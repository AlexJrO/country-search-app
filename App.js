import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform
} from "react-native";

export default function App() {

  // single state object for inputs
  const [form, setForm] = useState({
    country: "",
    region: ""
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);

  // shared handler
  const handleChange = (key, value) => {
    setForm({
      ...form,
      [key]: value
    });
  };

  // validation + API call
  const handleSubmit = async () => {

    // validation
    if (!form.country.trim()) {
      setError("Please type a country name");
      return;
    }

    setError("");
    setLoading(true);

    try {

      const response = await fetch(
        `https://restcountries.com/v3.1/name/${form.country}`
      );

      const data = await response.json();

      // filter by region if user typed
      let filtered = data;

      if (form.region.trim()) {
        filtered = data.filter(
          c =>
            c.region &&
            c.region.toLowerCase() === form.region.toLowerCase()
        );
      }

      setResults(filtered);

      if (filtered.length === 0) {
        setError("No results found");
      }

    } catch (e) {
      setError("API error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setForm({ country: "", region: "" });
    setResults([]);
    setError("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >

      <Text style={styles.title}>Country Search</Text>

      {/* controlled inputs */}

      <TextInput
        style={styles.input}
        placeholder="Country name"
        value={form.country}
        onChangeText={text => handleChange("country", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Region (optional)"
        value={form.region}
        onChangeText={text => handleChange("region", text)}
      />

      {/* error */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* buttons */}
      <Button
        title={loading ? "Searching..." : "Search"}
        onPress={handleSubmit}
        disabled={loading}
      />

      <Button
        title="Clear"
        onPress={clearForm}
      />

      {/* results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.cca3}
        renderItem={({ item }) => (

          <View style={styles.card}>

            <Text style={styles.country}>
              {item.name.common}
            </Text>

            <Text>
              Capital: {item.capital?.[0]}
            </Text>

            <Text>
              Region: {item.region}
            </Text>

            <Text>
              Population: {item.population}
            </Text>

          </View>

        )}
      />

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    marginTop: 50
  },

  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "bold"
  },

  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  },

  error: {
    color: "red",
    marginBottom: 10
  },

  card: {
    padding: 15,
    marginTop: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 8
  },

  country: {
    fontWeight: "bold",
    fontSize: 18
  }

});
