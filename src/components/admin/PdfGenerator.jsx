import React, { useState, useEffect } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

import BASEURL from "../../data/baseurl";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 10,
  },
  inputField: {
    marginBottom: 10,
  },
  image: {
    // width: 50,
    // height: 50,
    // Use the exact dimensions for your image placeholder
    border: "1px solid black",
    margin: "0 auto",
  },
});

// Create Document Component
const PdfGenerator = ({ userData }) => {
  const [base64Image, setBase64Image] = useState("");

  const token = localStorage.getItem("accessToken");

  const convertImageToBase64 = async (imageUrl) => {
    try {
      const response = await fetch(
        `${BASEURL.url}/admin/convert-image-to-base64?url=${imageUrl}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data, base64Image);
      return data.base64Image;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Define the async function inside the effect
    const fetchBase64Image = async () => {
      const imageUrl = userData.imageSrc; // The URL of the image you want to convert
      try {
        const base64String = await convertImageToBase64(imageUrl);
        setBase64Image(base64String);
      } catch (error) {
        console.error("Error fetching base64 image:", error);
        // Handle the error appropriately
        // For example, you might want to set the base64Image to null or show an error message
      }
    };

    // Call the async function
    if (userData.imageSrc) {
      fetchBase64Image();
    }
  }, [userData.imageSrc]); // Re-run the effect if the imageSrc changes

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.title}>
          <Text>Zilla Parishad Primary School, Bahuli</Text>
          <Text>North Facing East Side Room no. 2</Text>
        </View>
        <View style={styles.section}>
          <Text>Title: {userData.title}</Text>
          <Text>Name: {userData.name}</Text>
          <Text>Phone: {userData.phone}</Text>
          <Text>Address: {userData.address}</Text>
          {/* If you want to include an image, you need to pass the source here */}
          {base64Image && <Image style={styles.image} src={base64Image} />}
        </View>
        {/* Add more views as needed */}
      </Page>
    </Document>  
  );
};

export default PdfGenerator;
