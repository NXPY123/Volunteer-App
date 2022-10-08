import { StyleSheet, Text, View, Image, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native-web';
import { getDocs,collection,doc,setDoc } from "firebase/firestore";
import { addNewDoc,getPage,sign_out,query_db,new_task_details_html,org_profile_html,user_profile_html,users_collection,organisations_collection,auth,provider,top_level_url,index_html,loading_html,temp_html,new_user_details_html,new_organisation_details_html,environment,isNewUser,userType_html,createFile,uploadFile,downloadFile,tasks_collection,user_feed_html,task_images_storage_path,view_task_html,get_param_value,loadTasks,goToTask,volunteers_collection } from "./methods.js";
import { firebase,db,storage} from "./config.js";


let isVolunteered = false;
let isUser = false;



export const TaskDescription = ({ route }) => {
   const data = route.params;
   const imgsrc = {
      "Environmental": require("./assets/images/environment.png"),
      "Community": require("./assets/images/community.png"),
      "Animal": require("./assets/images/user.png"),
      "Education": require("./assets/images/education.png"),
   }
   let org_address = "";
   let org_website = "";
   let org_phone = "";
   let org_description = "";
   let org_email = "";

   auth.onAuthStateChanged(async function(user) {
      if (user) {
          // currentUser should be available now
          const user_query =  await query_db("Email", "==", user.email,users_collection);
          if(user_query.empty){
              //alert("You are not a user. Please login with a user account");
              //window.location = top_level_url + index_html;
              isUser = false;
          }
  
          
          else{
              isUser = true;
              const org_info = await query_db("Name", "==", data.data.organisation,organisations_collection);
               org_info.forEach((doc) => {
                  org_address = doc.data().Address;
                  org_website = doc.data().Website;
                  org_phone = doc.data().Phone;
                  org_description = doc.data()["About Us"];
                  org_email = doc.data().Email;

               });

              const volunteers_query = await query_db("Email", "==", user.email,volunteers_collection);
              for(const doc of volunteers_query.docs){
                  if(doc.data().TaskID == data.data.id){ //check if user has already submitted for volunteering
                      isVolunteered = true;
                  }
              }
          
          }
          
      }
      else{
          console.log("could not load user info from google");
          // No user logged in.
      }
  });

  
  



   console.log(data);
   return (
      <View style={styles.container}>
         <Image source={imgsrc[data.data.type]} style={styles.image} />
         <View style={styles.titleContainer}>
            <Text style={styles.title}>{data.data.name}</Text>
         </View>
         <View style={styles.tagContainer}>
            <View style={styles.logoContainer}>
               {data.data.type === "Environmental" && <Icon name="tree" size={15} color="#FF6B6B" />}
               {data.data.type === "Community" && <Icon name="user" size={15} color="#FF6B6B" />}
               {data.data.type === "Animal" && <Icon name="paw" size={15} color="#FF6B6B" />}
               {data.data.type === "Education" && <Icon name="book" size={15} color="#FF6B6B" />}
               {data.data.type === "Health" && <Icon name="medkit" size={15} color="#FF6B6B" />}

               <Text style={styles.logoText}>{`${data.data.type} `}</Text>

            </View>
            <View style={styles.logoContainer}>
               <Icon name="map-marker" size={17} color="#FF6B6B" />
               <Text style={styles.logoText}>{`${data.data.location} `}</Text>
            </View>
            <View style={styles.logoContainer}>
               <Icon name="male" size={17} color="#FF6B6B" />
               <Text style={styles.logoText}>{`${data.data.currVolunteers} Volunteers`}</Text>
            </View>
         </View>
         <View style={styles.descriptionContainer}>
            <Text style={styles.subtitle}>Job Description</Text>
            <Text style={styles.description}>{data.data.description}</Text>
         </View>
         <View style={styles.descriptionContainer}>
            <Text style={styles.subtitle}>Organisation Description</Text>
            {/* placeholder */}
            <Text style={styles.description}>{org_description}</Text>
         </View>
         <View style={styles.tagContainer}>
            <View style={styles.logoContainer}>
               <Icon name="phone" size={15} color="#FF6B6B" />
               <Text style={styles.logoText}>{org_phone}</Text>
            </View>
            <View style={styles.logoContainer}>
               <Icon name="envelope" size={15} color="#FF6B6B" />
               <Text style={styles.logoText}>{org_email}</Text>
            </View>
            <View style={styles.logoContainer}>
               <Icon name="search" size={15} color="#FF6B6B" />
               <Text style={styles.logoText}>{org_website}</Text>
            </View>
         </View>
         <TouchableOpacity style={styles.volunteerButton} onPress={async () =>{ 

         try{
           
            const task_query = await query_db("TaskID", "==", data.data.taskID,tasks_collection);
            if(task_query.empty){
               console.log(task_id);
               Alert.alert("No task found with that id");
              
            }
            let task_data = {};
            task_query.forEach((doc) => {
               // doc.data() is never undefined for query doc snapshots
            
               task_data[doc.id] = doc.data();
               // for(const key in doc.data()){

               //     task_data[key] = doc.data()[key]; 
                  
               //     //console.log(`${key}: ${doc.data()[key]}`);
               // }
            //console.log(doc.data());
            });
            const db_collection = volunteers_collection;
            //const email = user_data["Email"];
            const user_query =  await query_db("Email", "==", email,users_collection);
            if(user_query.empty){
               Alert.alert("You are not a user. Please login with a user account");
              
            }
            let user_data = {};
            user_query.forEach((doc) => {
               // doc.data() is never undefined for query doc snapshots
               for(const key in doc.data()){
                  user_data[key] = doc.data()[key];
               }
            });
            
            //const task_name = task_data["Name"];
         
            const task_name = task_data[Object.keys(task_data)[0]]["Name"];
            const task_id = task_data[Object.keys(task_data)[0]]["TaskID"];
            const org_id = task_data[Object.keys(task_data)[0]]["OrgID"];

            const db_doc = {
               "Email" : email,
               "Task Name": task_name,
               "TaskID": task_id,
               "OrgID": org_id,
               "Status": "Pending"
            }
         
            if(!isVolunteered){
               await addNewDoc(db_collection,db_doc);
               console.log("New Volunteer Details Added");
            }
            else{
               Alert.alert("You have already volunteered for this task");
            }

         }
         catch(err){
            console.log(err);
         }
         }} >
               <Text style={styles.volunteerText}>Volunteer</Text>
            </TouchableOpacity>
         <StatusBar style="auto" />
      </View>
   )
}


const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#F7FFF7",
   },
   image: {
      width: "100%",
      height: 200,
   },
   titleContainer: {
      backgroundColor: "rgba(78, 205, 196, 0.3);",
      padding: 10,
      marginBottom: 5,
   },
   title: {
      color: "#10383F",
      fontSize: 25,
      fontWeight: "bold",
   },
   tagContainer: {
      flexDirection: "row",
      marginBottom: 5,
   },
   logoContainer: {
      flexDirection: "row",
      color: "#FF6B6B",
      alignContent: "center",
      alignItems: "center",
      width: "33%",
      justifyContent: "center",

   },
   logoText: {
      color: "#FF6B6B",
      fontSize: 14,
      fontWeight: "500",
      paddingLeft: 2
   },
   descriptionContainer: {
      padding: 10,
   },
   subtitle: {
      color: "#10383F",
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 2,
   },
   description: {
      color: "#1A535C",
      fontSize: 14,
      fontWeight: "400",
   },
   volunteerButton: {
      backgroundColor: "#1A535C",
      width: "100%",
      height: 60,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
      position: "absolute",
      bottom: 0,
   }, 
   volunteerText: {
      color: "#F7FFF7",
      fontSize: 24,
   }


});



