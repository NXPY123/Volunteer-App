import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';


export const FeedCard = (props) => {
    // console.log(props);
    const imgsrc = {
        "Environmental": require("./assets/images/environment.png"),
        "Community": require("./assets/images/community.png"),
        "Animal": require("./assets/images/animal.png"),
        "Education": require("./assets/images/education.png"),
        "Health": require("./assets/images/health.png"),
    }

    const navigation = useNavigation();
    
    return (
      <View style={styles.feed}>
      <TouchableOpacity style={styles.container} activeOpacity={0.7} onPress={() => navigation.navigate("TaskDescription", {data:props})}>
      <View style={styles.card}>
        <Image source={imgsrc[props.type]} style={styles.image}/>
        <View style={styles.textContainer}>
        {/* Name */}
        <Text style={styles.name}>
            {props.name}
        </Text>
        {/* Organisation Name */}
         <Text style={styles.organisation}>
            {props.organisation}
         </Text>
        {/* Type and Location */}
        <View>
            <Text style={styles.text}>
                    {`${props.type} `}
                    
                    {props.type === "Environmental" && <Icon name="tree" size={13} color="#1A535C"/>}
                    {props.type === "Community" && <Icon name="user" size={13} color="#1A535C"/>}
                    {props.type === "Animal" && <Icon name="paw" size={13} color="#1A535C"/>}
                    {props.type === "Education" && <Icon name="book" size={13} color="#1A535C"/>}
                    {props.type === "Health" && <Icon name="medkit" size={13} color="#1A535C"/>}
                </Text>
                <Text style={styles.text}>
                    {`${props.location} `}
                    <Icon name="map-marker" size={13} color="#1A535C"/>
                </Text>
        </View>
        <View style={styles.dateContainer}>
        <Text style={styles.date}> 
            {props.date}
                </Text>
        </View>
        </View>   
        </View>
      </TouchableOpacity>

      </View>
    );
}

const styles = StyleSheet.create({
      feed: {
      },
    container: {
    },
    card: {
         flexDirection: 'row',
         width: '100%',
         height: 90,
         borderRadius: 10,
         backgroundColor: "#F7FFF7",
         elevation: 5,
         overflow: 'hidden',
         marginBottom: 10,
      },
    textContainer: {
        flex: 2.5,
        color: "1A535C",
        // paddingLeft: 10,
        // paddingRight: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: "#F7FFF7",
    },
    image: {
        flex: 1,
        height: 100,
        width: 50,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    name: {
        fontSize: 15,
        color: "#1A535C",
        fontWeight: "500",
        paddingLeft: 10,
    },
   organisation: {
         fontSize: 11,
         color: "#1A535C",
         paddingBottom: 2,
         fontWeight: "500",
         paddingLeft: 10,
   },
    text: {
        fontSize: 11,
        color: "#1A535C",
        paddingLeft: 10,
    },
    dateContainer: {
        // position: 'absolute',
        // bottom: 0,
        // left: 0,
        // width: '100%',
        // height: 15,
        flex: 1,
        backgroundColor: "#FF6B6B",
        justifyContent: 'center',
        borderBottomRightRadius: 10,
        paddingLeft: 10,
    },
    date: {
        fontSize: 10,
        fontWeight: "300",
        color: "#F7FFF7",
    },

});