import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { BackHandler, Dimensions, ImageBackground } from "react-native";
import {
    View,
    StyleSheet,
    Text,
    Alert,
    Image,
    TouchableOpacity,
    FlatList,
} from "react-native";

const deviceWidth = Dimensions.get("screen").width;
const deviceheight = Dimensions.get("screen").height;

const HomeScreen = (props) => {
    // Use states
    const [output, setOutput] = useState();
    const [firstName, setFirstName] = useState("");
    const [refresh, setRefresh] = useState(false);


    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
        };
    }, []);


    const handleBackButtonClick = () => {
        props.navigation.pop(2)
    }


    useFocusEffect(
        React.useCallback(() => {
            // getProductData()
            getFirstNameFromSignup();
            getProductDataOfUser();
        }, []));

    const refreshList = useCallback(() => {
        console.log("refreshList function call =====");
        setRefresh(!refresh);
        getProductDataOfUser();

    })


    //  Function for get product data from Productkey of asyncstorage
    // const getProductData = async () => {
    //     const showItem = await AsyncStorage.getItem("ProductKey");
    //     const getItem = JSON.parse(showItem)
    //     console.log('Homepage prodductItem ===>', getItem);
    //     setOutput(getItem)
    //     setRefresh(false)
    // }

    const getProductDataOfUser = async () => {
        try {
            var productDataAfterLogin = [];

            const loginshowItem = await AsyncStorage.getItem("Loginkey");
            const loginitem = JSON.parse(loginshowItem);

            const productShowItem = await AsyncStorage.getItem("ProductKey");
            const productitem = JSON.parse(productShowItem);

            for (let product of productitem) {
                if (product?.userid == loginitem[0]?.userid) {
                    productDataAfterLogin.push(product);
                }
            }
            setOutput(productDataAfterLogin);
            setRefresh(false)
        } catch (error) {
            console.log("show product error ===>", error);
        }
    };

    // Function for get firstname from Loginkey of asyncstorage
    const getFirstNameFromSignup = async () => {
        try {
            const showItem = await AsyncStorage.getItem("Loginkey");

            if (showItem !== null) {
                const result = JSON.parse(showItem);
                setFirstName(result[0].firstName);
                setRefresh(false);
                return showItem;
            }
        } catch (error) {
            console.log("error ===>", error);
        }
    };

    // Function for push data of array
    const event = (item) => {
        const array = [...output];
        array.push(item);
        setOutput(array);
        console.log("output array ", array);
    };

    // Function of delete the data
    const deleteData = (index) => {
        Alert.alert("Are You Sure ?", "You want to delete ?", [
            {
                text: "Yes",
                onPress: () => {
                    const array = [...output];
                    // console.log("array :", array)
                    const deletedarray = array.splice(index, 1);
                    // console.log("deletearray :", deletedarray)
                    AsyncStorage.removeItem("ProductKey");
                    setOutput(array);
                },
            },
            { text: "No", onPress: () => console.log("Okay"), style: "cancel" },
        ]);
    };

    // Function for edit the data
    const editData = (item) => {
        props.navigation.navigate("AddProduct", {
            item,
            refreshList: refreshList,
        });
    };

    // Function for Show item of flatlist
    const Item = ({ item, index }) => (
        <View style={styles.mainView}>
            <View>
                <Text style={styles.textStyle}> ID : {item.Id}</Text>
                <Text style={styles.textStyle}> Name : {item.Name}</Text>
                <Text style={styles.textStyle}> Adress : {item.Address}</Text>
            </View>

            <View style={styles.iconViewstyle}>
                <TouchableOpacity
                    onPress={() => {
                        editData(item);
                    }}
                >
                    <Image
                        style={styles.iconStyle}
                        source={require("../../../assets/edit.png")}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        deleteData(index);
                    }}
                >
                    <Image
                        style={styles.iconStyle}
                        source={require("../../../assets/delete.png")}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );

    // Function for Logout
    const LogOut = async () => {
        try {
            props.navigation.navigate("Login");
            await AsyncStorage.removeItem("Loginkey");
            // await AsyncStorage.clear();
            console.log("Log out successfully");
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../../../assets/bg.png")}
                resizeMode="cover"
                style={styles.ImageBackground}
            >
                <View style={styles.firstView}>
                    <Text style={styles.heading}>Hello, {firstName}</Text>
                    <TouchableOpacity
                        onPress={() =>
                            props.navigation.navigate("AddProduct", {
                                event: event,
                                refreshList: refreshList,
                            })
                        }
                    >
                        <Image
                            style={styles.image}
                            resizeMode={"contain"}
                            source={require("../../../assets/add.png")}
                        />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={output}
                    renderItem={({ item, index }) => <Item item={item} index={index} />}
                    ItemSeparatorComponent={<View style={{ width: 10, height: 10 }} />}
                />

                <TouchableOpacity
                    onPress={() => {
                        LogOut();
                    }}
                >
                    <Text style={styles.logoutButtonStyle}>Log Out</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "orange",
    },
    ImageBackground: {
        flex: 1,
        justifyContent: "center",
    },
    heading: {
        color: "#1e90ff",
        fontSize: 25,
        fontWeight: "bold",
    },
    image: {
        height: 35,
        width: 35,
        tintColor: "white",
    },
    iconViewstyle: {
        width: deviceWidth / 2,
        height: deviceheight / 10,
        flexDirection: "row",
        alignItems: "center",
    },
    iconStyle: {
        height: 40,
        width: 40,
        marginHorizontal: 20,
    },
    firstView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        margin: 30,
    },
    logoutButtonStyle: {
        width: "30%",
        fontSize: 20,
        fontWeight: "bold",
        color: "black",
        borderRadius: 20,
        alignSelf: "center",
        textAlign: "center",
        backgroundColor: "orange",
        padding: 7,
        elevation: 5,
        marginVertical: 20,
    },
    mainView: {
        width: deviceWidth,
        borderWidth: 3,
        borderColor: "grey",
        padding: 10,
        flexDirection: "row",
    },
    textStyle: {
        fontSize: 15,
        color: "black",
        width: deviceWidth / 2,
    },
    addButton: {
        fontSize: 20,
        color: "black",
        fontWeight: "bold",
        borderRadius: 20,
        backgroundColor: "#f0ffff",
        padding: 7,
        height: 40,
        width: 50,
        textAlign: "center",
    },
});
export default HomeScreen;
