import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ProductGrid from '../components/ProductGrid'

const ProductScreen = ({ navigation }) => {
    return (
        <View>
            <ProductGrid navigation={navigation} />
        </View>
    )
}

export default ProductScreen

const styles = StyleSheet.create({})