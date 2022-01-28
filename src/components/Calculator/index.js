import React, {useEffect, useState} from 'react';

import * as xlsx from "xlsx";
import {Input, Select} from 'antd';

import 'antd/dist/antd.css'
import './index.scss';
import {grade, risks} from "../../config";
import {createGuid, fetchProductsFromServer, parseProductTypes, uploadNewProductsExcel} from "../../util";

const {Option} = Select;

function Calculator() {

    const [totalSum, setTotalSum] = useState();
    const [clientRisk, setClientRisk] = useState();
    const [products, setProducts] = useState([]);
    const [productList, setProductList] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [sha, setSha] = useState();

    useEffect(() => {

        fetchProductsFromServer().then(data => {
            setSha(data.sha);
            setProductList(data.products);
            const types = parseProductTypes(data.products);
            setProductTypes(types);
        });

    }, []);

    const readUploadFile = (e) => {
        e.preventDefault();
        if (e.target.files) {

            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = xlsx.read(data, {type: "array"});
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = xlsx.utils.sheet_to_json(worksheet);

                setProductList(json);

                const types = parseProductTypes(json);

                setProductTypes(types)

                uploadNewProductsExcel(json, sha).then(() => {
                    console.log('success')
                })
            };
            reader.readAsArrayBuffer(e.target.files[0]);
        }
    }

    const getRiskText = (portfolioRisk) => {

        let colorModifier;
        let riskText;

        if (clientRisk === portfolioRisk) {

            colorModifier = 'calculator-main-body-numbers-text_green';
            riskText = 'Риск соответствует вашему профилю';
        } else if (clientRisk < portfolioRisk) {

            colorModifier = 'calculator-main-body-numbers-text_red';
            riskText = 'Риск портфеля превышен';
        } else {

            colorModifier = 'calculator-main-body-numbers-text_gray';
            riskText = 'Вы недополучаете потенциальный доход';
        }

        return (<div className={`calculator-main-body-numbers-text ${colorModifier}`}>
            {riskText}
        </div>);
    }

    const getPortfolioValues = (field) => {

        if (products.length === 0 || !totalSum) {

            return 0;
        } else {

            const productsSum = products.reduce((accumulator, product) => {

                const productValue = product['sum'] && product[field] ? product['sum'] * product[field] : 0;

                return accumulator + productValue;
            }, 0);

            if (field === 'stress_scen') {

                return getGradeRiskValue(Math.abs(productsSum / totalSum) * 100);
            } else {

                return (productsSum / totalSum * 100).toFixed(2);
            }
        }
    }

    const getPortfolioRisk = () => {

        const portfolioRisk = getPortfolioValues('stress_scen');

        return (<div className="calculator-main-body-numbers-number">
            <div className="calculator-main-body-numbers-number__title">
                Риск рейтинг
            </div>
            <div className="calculator-main-body-numbers-number__value">
                {`${portfolioRisk} из 5`}
            </div>
            <div className="calculator-main-body-numbers-text">
                {clientRisk ? getRiskText(portfolioRisk) : ''}
            </div>
        </div>);
    }

    const handleRiskChange = (value) => {

        return setClientRisk(value);
    }

    const handleAddProduct = () => {

        const productsCopy = [...products];

        productsCopy.push({
            guid: createGuid(),
        });

        setProducts(productsCopy);
    }

    const handleProductChange = (value, option, product, field) => {

        const productsCopy = [...products];

        const index = productsCopy.findIndex(item => item.guid === product.guid);

        if (field === 'product_id') {

            const productFromList = productList.find(item => item.product_id === value);

            productsCopy[index] = {
                ...productsCopy[index], ...productFromList, [field]: value,
            }
        } else {

            productsCopy[index] = {
                ...productsCopy[index], [field]: value,
            }
        }

        setProducts(productsCopy);
    }

    const renderProductLeftSide = (product, index) => {

        let products;

        if (product.type) {
            products = productList.filter(item => {
                return item.type === product.type;
            })
        } else products = productList;

        return (<div className="calculator-products-left-body-product" key={index}>
            <Select
                className="calculator-products-left-body-product__type"
                onChange={(value, option) => handleProductChange(value, option, product, 'type')}
                dropdownMatchSelectWidth={false}
            >
                {productTypes.map((item, index) => {
                    return <Option key={index} value={item}>{item}</Option>
                })}
            </Select>
            <Select
                className="calculator-products-left-body-product__name"
                onChange={(value, option) => handleProductChange(value, option, product, 'product_id')}
                dropdownMatchSelectWidth={false}
            >
                {products.map((item, index) => {
                    return (<Option
                        key={index}
                        value={item.product_id}
                    >
                        {item.name} {(item.isin && item.isin !== 'NULL') || ''}
                    </Option>)
                })}
            </Select>
            <Input
                className="calculator-products-left-body-product__sum"
                suffix='₽'
                type="number"
                value={product['sum']}
                onChange={e => handleProductChange(e.target.value, null, product, 'sum')}
            />
        </div>)
    }

    const getGradeRiskValue = (stressScen) => {

        const gradeMatched = grade.find(item => {
            return stressScen >= item.min && stressScen <= item.max;
        });

        if (gradeMatched) return gradeMatched.value;

        return null;
    }

    const renderProductRightSide = (product, index) => {

        return (<div className="calculator-products-right-body-product" key={index}>
            <div className="calculator-products-right-body-product__value">
                {product['sum'] && totalSum ? (100 / (totalSum / product['sum'])).toFixed(2) + '%' : ''}
            </div>
            <div className="calculator-products-right-body-product__value">
                {product.stress_scen ? getGradeRiskValue(Math.abs(product.stress_scen * 100)) : ''}
            </div>
            <div className="calculator-products-right-body-product__value">
                {product.neutr_scen ? (product.neutr_scen * 100).toFixed(2) + '%' : ''}
            </div>
        </div>);
    }

    const handleProductRemove = (index) => {

        const productsCopy = [...products];

        productsCopy.splice(index, 1);

        setProducts(productsCopy);
    }

    const renderProductRemoveBtn = (product, index) => {

        return (<div
            className="calculator-products-remove-products__product"
            key={index}
            onClick={() => handleProductRemove(index)}
        />);
    }

    return (<div className="calculator-container">
        <div className="calculator-header">
            <div className="calculator-header__title">
                Расчет
            </div>
            <div className="calculator-header-upload">
                <Input
                    type="file"
                    name="upload"
                    id="upload"
                    onChange={readUploadFile}
                />
            </div>
        </div>
        <div className="calculator-main">
            <div className="calculator-main__header">Параметры</div>
            <div className="calculator-main-body">
                <div className="calculator-main-body-input">
                    <div className="calculator-main-body-input__title">Сумма</div>
                    <Input
                        className="calculator-main-body-input__input"
                        suffix='₽'
                        type="number"
                        value={totalSum}
                        onChange={(e => setTotalSum(e.target.value))}
                    />
                </div>
                <div className="calculator-main-body-input">
                    <div className="calculator-main-body-input__title">Инвестпрофиль</div>
                    <Select
                        className="calculator-main-body-input__select"
                        onChange={handleRiskChange}
                        value={clientRisk}
                    >
                        {risks.map((item, index) => {
                            return <Option key={index} value={item.value}>{item.title}</Option>
                        })}
                    </Select>
                </div>
                <div className="calculator-main-body-numbers">
                    {getPortfolioRisk()}
                    <div className="calculator-main-body-numbers-number">
                        <div className="calculator-main-body-numbers-number__title">
                            Доходность
                        </div>
                        <div className="calculator-main-body-numbers-number__value">
                            {getPortfolioValues('neutr_scen')}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="calculator-add-btn-container">
            <div className="calculator-add-btn" onClick={handleAddProduct}>
                <div className="calculator-add-btn__cross"/>
                <div className="calculator-add-btn__text">
                    Добавить продукт
                </div>
            </div>
        </div>
        <div className="calculator-products">
            <div className="calculator-products-left">
                <div className="calculator-products-left-header">
                    <div className="calculator-products-left-header__type">Тип</div>
                    <div className="calculator-products-left-header__name">Название</div>
                    <div className="calculator-products-left-header__sum">Сумма</div>
                </div>
                <div className="calculator-products-left-body">
                    {products.map(renderProductLeftSide)}
                </div>
            </div>
            <div className="calculator-products-right">
                <div className="calculator-products-right-header">
                    <div className="calculator-products-right-header__title">Доля</div>
                    <div className="calculator-products-right-header__title">Риск</div>
                    <div className="calculator-products-right-header__title">Доход</div>
                </div>
                <div className="calculator-products-right-body">
                    {products.map(renderProductRightSide)}
                </div>
            </div>
            <div className="calculator-products-remove-products">
                {products.map(renderProductRemoveBtn)}
            </div>
        </div>
    </div>);
}

export default Calculator;
