import React from 'react';

import {Document, Font, Page, Text, View} from '@react-pdf/renderer'

import 'antd/dist/antd.css'
import {currencies, risks} from "../../config";

import styleSheet from './style';

function PdfBriefcase({
                          totalSum,
                          clientRisk,
                          qualMode,
                          products,
                          calcPortfolioRisk,
                          getPortfolioRiskTextAndColorModifier,
                          getPortfolioYield,
                          getProductPercentage,
                          getGradeRiskValue,
                      }) {

    Font.register({
        family: "Roboto",
        src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
    });

    const styles = styleSheet();

    const renderPortfolioRisk = () => {

        const portfolioRisk = calcPortfolioRisk();
        const textAndColor = getPortfolioRiskTextAndColorModifier(portfolioRisk);

        return (
            <View>
                <Text style={styles.mainBodyInfoValue}>
                    {`${portfolioRisk} из 5`}
                </Text>
                <Text
                    style={[styles.mainBodyInfoRiskText, styles[`mainBodyInfoRiskText${textAndColor.colorModifier}`]]}
                >
                    {textAndColor.riskText}
                </Text>
            </View>
        );
    }

    const renderProduct = (product, index) => {

        const productCurrency = currencies.find(currency => currency.name === product.currency);

        let currencySuffix;

        if (productCurrency) currencySuffix = productCurrency.suffix;

        return (
            <View style={styles.productsProduct} key={index}>
                <Text style={styles.productsProductType}>
                    {product.type}
                </Text>
                <Text style={styles.productsProductValue}>
                    {product.currency}
                </Text>
                <Text style={styles.productsProductName}>
                    {product.name} {(product['isin'] && product['isin'] !== 'NULL') || ''}
                </Text>
                <Text style={styles.productsProductSum}>
                    {product['sum'] ? product['sum'] + currencySuffix : ''}
                </Text>
                <Text style={styles.productsProductValue}>
                    {product['sum'] && totalSum && product['currency'] ? getProductPercentage(product['sum'], product['currency'], totalSum) + '%' : ''}
                </Text>
                <Text style={styles.productsProductValue}>
                    {Math.round(product.product_risk)}
                </Text>
                <Text style={styles.productsProductValue}>
                    {product['neutr_scen'] ? (product['neutr_scen'] * 100).toFixed(2) + '%' : ''}
                </Text>
            </View>
        );
    }

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Портфель</Text>
                </View>
                <View style={styles.main}>
                    <Text style={styles.mainHeader}>Параметры</Text>
                    <View style={styles.mainBody}>
                        <View style={styles.mainBodyInfo}>
                            <Text style={styles.mainBodyInfoTitle}>Сумма</Text>
                            <Text style={styles.mainBodyInfoValue}>{`${totalSum || 0}Р`}</Text>
                        </View>
                        <View style={styles.mainBodyInfo}>
                            <Text style={styles.mainBodyInfoTitle}>Инвестпрофиль</Text>
                            <Text
                                style={styles.mainBodyInfoValue}>{clientRisk ? risks[clientRisk - 1].title : ''}</Text>
                        </View>
                        <View style={styles.mainBodyInfo}>
                            <Text style={styles.mainBodyInfoTitle}>Риск рейтинг</Text>
                            {renderPortfolioRisk()}
                        </View>
                        <View style={styles.mainBodyInfo}>
                            <Text style={styles.mainBodyInfoTitle}>Риск рейтинг</Text>
                            <Text style={styles.mainBodyInfoValue}>RUB - {getPortfolioYield('RUB')}%</Text>
                            <Text style={styles.mainBodyInfoValue}>USD - {getPortfolioYield('USD')}%</Text>
                            <Text style={styles.mainBodyInfoValue}>EUR - {getPortfolioYield('EUR')}%</Text>
                        </View>
                    </View>
                </View>
                {qualMode ?
                    <View style={styles.qualStatus}>
                        <Text style={styles.qualStatusText}>Режим КИ</Text>
                    </View>
                    : null
                }
                <View style={styles.products}>
                    <View style={styles.productsHeader}>
                        <Text style={styles.productsHeaderType}>Тип</Text>
                        <Text style={styles.productsHeaderTitle}>Валюта</Text>
                        <Text style={styles.productsHeaderName}>Название</Text>
                        <Text style={styles.productsHeaderSum}>Сумма</Text>
                        <Text style={styles.productsHeaderTitle}>Доля</Text>
                        <Text style={styles.productsHeaderTitle}>Риск</Text>
                        <Text style={styles.productsHeaderTitle}>Доход</Text>
                    </View>
                    {products.length ? products.map(renderProduct) : null}
                </View>
            </Page>
        </Document>
    );
}

export default PdfBriefcase;
