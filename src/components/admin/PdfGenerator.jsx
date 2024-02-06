import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
  },
  header: {
    fontSize: "15px",
    marginBottom: "20px",
    textAlign: "center",
    fontWeight: '800'
  },
  detailSection: {
    display: "flex",
    flexDirection: "row",
    alignItems: 'center',
    marginBottom: "6px",
  },
  detailTitle: {
    fontWeight: "bold",
  },
  detailText: {
    fontSize: "12px",
    width:'50%'
  },
  imageContainer: {
    position: "absolute",
    right: 30,
    top: 70,
    width: "80px",
    height: "80px",
    border: "1px solid black",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

// Create Document Component
const PdfGenerator = ({ volunteerData }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} src={volunteerData.photo_url} />
        </View>
        <Text style={styles.header}>{volunteerData.booth_address}</Text>
        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>Title: </Text>
          <Text style={styles.detailText}>{volunteerData.designation}</Text>
        </View>
        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>Name: </Text>
          <Text style={styles.detailText}>{volunteerData.volunteer_name}</Text>
        </View>
        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>Phone: </Text>
          <Text style={styles.detailText}>{volunteerData.phn_no}</Text>
        </View>
        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>Address: </Text>
          <Text style={styles.detailText}>{volunteerData.volunteer_address}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PdfGenerator;


