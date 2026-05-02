import { useEffect, useState, useRef } from "react";
import {View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} from "../firebase/productService";

export default function HomeScreen({ navigation, route }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [barcode, setBarcode] = useState("");
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errors, setErrors] = useState({});

  const priceRef = useRef(null);
  const barcodeRef = useRef(null);

  async function loadProducts() {
    setLoadingProducts(true);
    try {
      const productList = await getProducts();
      setProducts(productList);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar os produtos.");
    } finally {
      setLoadingProducts(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (route.params?.scannedBarcode) {
      setBarcode(String(route.params.scannedBarcode));
    }
  }, [route.params?.scannedBarcode]);

  function clearForm() {
    setName("");
    setPrice("");
    setBarcode("");
    setEditingProductId(null);
    setErrors({});
  }

  function validate() {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório.';
    }

    if (!price.trim()) {
      newErrors.price = 'Preço é obrigatório.';
    } else if (isNaN(parseFloat(price.replace(',', '.')))) {
      newErrors.price = 'Informe um preço válido.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSaveProduct() {
    if (!validate()) return;

    setLoading(true);
    const productData = {
      name: name.trim(),
      price: price.trim(),
      barcode: barcode ? String(barcode).trim() : "",
    };

    try {
      if (editingProductId) {
        await updateProduct(editingProductId, productData);
        Alert.alert("Sucesso", "Produto atualizado com sucesso!");
      } else {
        await createProduct(productData);
        Alert.alert("Sucesso", "Produto cadastrado com sucesso!");
      }
      clearForm();
      await loadProducts();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar o produto.");
    } finally {
      setLoading(false);
    }
  }

  function handleEditProduct(product) {
    setName(product.name || "");
    setPrice(product.price || "");
    setBarcode(product.barcode || "");
    setEditingProductId(product.id);
    setErrors({});
  }

  async function handleDeleteProduct(productId) {
    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja excluir este produto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProduct(productId);
              if (editingProductId === productId) clearForm();
              Alert.alert("Sucesso", "Produto excluído com sucesso!");
              await loadProducts();
            } catch (error) {
              console.error(error);
              Alert.alert("Erro", "Não foi possível excluir o produto.");
            }
          },
        },
      ]
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Bem-vindo!</Text>

            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => navigation.navigate("BarcodeScanner")}
            >
              <Text style={styles.scanButtonText}>📷 Ler código de barras</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>
              {editingProductId ? "✏️ Editar produto" : "➕ Novo produto"}
            </Text>

            <TextInput
              placeholder="Nome do produto"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setErrors((e) => ({ ...e, name: null }));
              }}
              returnKeyType="next"
              onSubmitEditing={() => priceRef.current?.focus()}
              style={[styles.input, errors.name && styles.inputError]}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <TextInput
              ref={priceRef}
              placeholder="Preço (ex: 19.90)"
              value={price}
              onChangeText={(text) => {
                setPrice(text);
                setErrors((e) => ({ ...e, price: null }));
              }}
              keyboardType="numeric"
              returnKeyType="next"
              onSubmitEditing={() => barcodeRef.current?.focus()}
              style={[styles.input, errors.price && styles.inputError]}
            />
            {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

            <TextInput
              ref={barcodeRef}
              placeholder="Código de barras"
              value={barcode}
              onChangeText={setBarcode}
              returnKeyType="done"
              onSubmitEditing={handleSaveProduct}
              style={styles.input}
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSaveProduct}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {editingProductId ? "Atualizar produto" : "Cadastrar produto"}
                </Text>
              )}
            </TouchableOpacity>

            {editingProductId && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={clearForm}
              >
                <Text style={styles.cancelButtonText}>Cancelar edição</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.sectionTitle}>📦 Produtos cadastrados</Text>

            {loadingProducts && (
              <ActivityIndicator
                size="large"
                color="#1976d2"
                style={{ marginVertical: 20 }}
              />
            )}

            {!loadingProducts && products.length === 0 && (
              <Text style={styles.emptyText}>Nenhum produto cadastrado.</Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productInfo}>💰 Preço: R$ {item.price}</Text>
            <Text style={styles.productInfo}>
              🔖 Código: {item.barcode || "Não informado"}
            </Text>

            <View style={styles.productActions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditProduct(item)}
              >
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteProduct(item.id)}
              >
                <Text style={styles.deleteButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 20,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 12,
    color: "#444",
  },
  scanButton: {
    backgroundColor: "#37474f",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 4,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#e53935",
  },
  errorText: {
    color: "#e53935",
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  button: {
    backgroundColor: "#1976d2",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: "#90caf9",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#e53935",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  cancelButtonText: {
    color: "#e53935",
    fontSize: 16,
  },
  emptyText: {
    color: "#999",
    textAlign: "center",
    marginVertical: 20,
    fontSize: 15,
  },
  productCard: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  productInfo: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  productActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  editButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#ffebee",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#e53935",
    fontWeight: "bold",
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  logoutButtonText: {
    color: "#666",
    fontSize: 16,
  },
});