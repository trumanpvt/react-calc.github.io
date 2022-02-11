import {StyleSheet} from '@react-pdf/renderer'

const styles = () => {
    return StyleSheet.create({
        page: {
            flexDirection: 'column',
            backgroundColor: '#fff',
            fontFamily: 'Roboto',
            padding: 30,
            color: '#262626',
        },
        header: {
            width: '100%',
        },
        headerText: {
            fontSize: 34,
        },
        main: {
            marginVertical: 28,
            paddingVertical: 32,
            paddingHorizontal: 28,
            borderWidth: 1,
            borderColor: '#262626',
            borderRadius: 8,
        },
        mainHeader: {
            fontSize: 22,
        },
        mainBody: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',

        },
        mainBodyInfo: {
            marginTop: 28,
            width: '45%',
            fontSize: 13,
        },
        mainBodyInfoTitle: {
            marginBottom: 8,
        },
        mainBodyInfoValue: {
            marginBottom: 4,
        },
        mainBodyInfoRiskText: {},
        mainBodyInfoRiskTextgreen: {
            color: '#27AE60',
        },
        mainBodyInfoRiskTextred: {
            color: '#F31B31',
        },
        mainBodyInfoRiskTextgray: {
            color: '#BDBDBD',
        },
        qualStatus: {
            marginBottom: 28,
        },
        qualStatusText: {
            fontSize: 15,
        },
        products: {},
        productsHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 10,
            fontSize: 12,
        },
        productsHeaderType: {
            width: '20%',
        },
        productsHeaderCurrency: {
            width: '5%',
        },
        productsHeaderName: {
            paddingLeft: 20,
            width: '25%',
        },
        productsHeaderSum: {
            paddingLeft: 20,
            width: '20%',
        },
        productsHeaderTitle: {
            width: '10%',
        },
        productsProduct: {
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 10,
            fontSize: 8,
        },
        productsProductType: {
            width: '20%',
        },
        productsProductCurrency: {
            width: '5%',
        },
        productsProductName: {
            paddingLeft: 20,
            width: '25%',
        },
        productsProductSum: {
            paddingLeft: 20,
            width: '20%',
        },
        productsProductValue: {
            width: '10%',
        },
    })
}

export default styles;
