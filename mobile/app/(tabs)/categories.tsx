// mobile/app/(tabs)/categories.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import SafeScreen from "@/components/SafeScreen";
import useProducts from "@/hooks/useProducts";
import { Product } from "@/types";

type ProductWithId = Product & {
  _id?: string;
  id?: string;
  images?: string[];
};

const CategoryScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const {
    data: products,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useProducts();

  const categories = useMemo(() => {
    const set = new Set<string>();
    products?.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (selectedCategory === "All") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const renderCategory = ({ item }: { item: string }) => {
    const active = item === selectedCategory;
    return (
      <TouchableOpacity
        onPress={() => setSelectedCategory(item)}
        style={{
          paddingVertical: 14,
          paddingHorizontal: 12,
          backgroundColor: active ? "#f2f2f2" : "transparent",
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: active ? "700" : "500",
            color: active ? "#111" : "#555",
          }}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderProduct = ({ item }: { item: ProductWithId }) => {
    const imageUri = item.images?.[0];
    return (
      <View
        style={{
          width: "33.33%",
          padding: 10,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            aspectRatio: 1,
            borderRadius: 14,
            backgroundColor: "#f7f7f7",
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
            />
          ) : (
            <Ionicons name="image-outline" size={32} color="#999" />
          )}
        </View>
        <Text
          numberOfLines={2}
          style={{
            marginTop: 8,
            textAlign: "center",
            fontSize: 13,
            color: "#111",
            fontWeight: "600",
          }}
        >
          {item.name}
        </Text>
      </View>
    );
  };

  return (
    <SafeScreen>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            paddingVertical: 14,
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "800", color: "#111" }}>
            Categories
          </Text>
          <Ionicons name="help-circle-outline" size={22} color="#111" />
        </View>

        <View style={{ flexDirection: "row", flex: 1 }}>
          {/* Left sidebar */}
          <View
            style={{
              width: 120,
              backgroundColor: "#fafafa",
              borderRightWidth: 1,
              borderRightColor: "#eee",
            }}
          >
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={renderCategory}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 8 }}
            />
          </View>

          {/* Right content */}
          <View style={{ flex: 1 }}>
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "700", color: "#111" }}>
                {selectedCategory === "All"
                  ? "Recommendations"
                  : selectedCategory}
              </Text>
              <Text style={{ fontSize: 12, color: "#777" }}>
                {filteredProducts.length} items
              </Text>
            </View>

            {isLoading ? (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator size="small" color="#ff6a00" />
                <Text style={{ marginTop: 8, color: "#777" }}>
                  Loading products...
                </Text>
              </View>
            ) : isError ? (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    color: "#d00",
                    textAlign: "center",
                  }}
                >
                  Failed to load products
                </Text>
                <TouchableOpacity
                  onPress={() => refetch()}
                  style={{
                    marginTop: 10,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    backgroundColor: "#ff6a00",
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "700" }}>
                    Retry
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={filteredProducts as ProductWithId[]}
                keyExtractor={(item, index) =>
                  (item._id ?? item.id ?? `prod-${index}`)
                }
                renderItem={renderProduct}
                numColumns={3}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 6,
                  paddingBottom: 24,
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={isRefetching}
                    onRefresh={refetch}
                  />
                }
                ListEmptyComponent={
                  <View
                    style={{
                      padding: 20,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: "#555" }}>No products found.</Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </View>
    </SafeScreen>
  );
};

export default CategoryScreen;