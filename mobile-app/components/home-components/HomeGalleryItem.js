import React, {useState, useRef} from "react";
import { TouchableOpacity, View, Text, Image, FlatList, StyleSheet, Dimensions, Carousel } from "react-native";
import { useNavigate } from "react-router-native";

const { width } = Dimensions.get('window');
const SPACING = 10;
const THUMB_SIZE = 80;
const IMAGES = {
    image1: require('../../assets/banner1.jpg'),
    image2: require('../../assets/banner2.jpg'),
    image3: require('../../assets/banner3.jpg'),
  };
  
const HomeGalleryItem = () => {
    const [images, setImages] = useState([
        { id: '1', image: IMAGES.image1 },
        { id: '2', image: IMAGES.image2 },
        { id: '3', image: IMAGES.image3 },
      ]);
    return (
        <View style={{ flex: 1 / 2, marginTop: 20 }}>
        <Carousel
            layout='default'
            data={images}
            sliderWidth={width}
            itemWidth={width}
            renderItem={({ item, index }) => (
            <Image
                key={index}
                style={{ width: '100%', height: '100%' }}
                resizeMode='contain'
                source={item.image}
            />
            )}
        />
        </View>
    );
}
const styles = StyleSheet.create({
    items: {

    }
});

export default HomeGalleryItem;