// import axiosInstance from "./axios";

// export const productApi = {
//   getAll: async () => {
//     const { data } = await axiosInstance.get("/admin/products");
//     return data;
//   },

//   create: async (formData) => {
//     const { data } = await axiosInstance.post("/admin/products", formData);
//     return data;
//   },

//   update: async ({ id, formData }) => {
//     const { data } = await axiosInstance.put(`/admin/products/${id}`, formData);
//     return data;
//   },

//   delete: async (productId) => {
//     const { data } = await axiosInstance.delete(`/admin/products/${productId}`);
//     return data;
//   },
// };

// export const orderApi = {
//   getAll: async () => {
//     const { data } = await axiosInstance.get("/admin/orders");
//     return data;
//   },

//   updateStatus: async ({ orderId, status }) => {
//     const { data } = await axiosInstance.patch(`/admin/orders/${orderId}/status`, { status });
//     return data;
//   },
// };

// export const statsApi = {
//   getDashboard: async () => {
//     const { data } = await axiosInstance.get("/admin/stats");
//     return data;
//   },
// };

// export const customerApi = {
//   getAll: async () => {
//     const { data } = await axiosInstance.get("/admin/customers");
//     return data;
//   },
// };








import axiosInstance from "./axios";

export const productApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get("/admin/products");
    return data;
  },
  create: async (formData) => {
    const { data } = await axiosInstance.post("/admin/products", formData);
    return data;
  },
  update: async ({ id, formData }) => {
    const { data } = await axiosInstance.put(`/admin/products/${id}`, formData);
    return data;
  },
  delete: async (productId) => {
    const { data } = await axiosInstance.delete(`/admin/products/${productId}`);
    return data;
  },
};

export const orderApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get("/admin/orders");
    return data;
  },
  updateStatus: async ({ orderId, status }) => {
    const { data } = await axiosInstance.patch(`/admin/orders/${orderId}/status`, { status });
    return data;
  },
};

export const statsApi = {
  getDashboard: async () => {
    const { data } = await axiosInstance.get("/admin/stats");
    return data;
  },
};

export const customerApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get("/admin/customers");
    return data;
  },
};

/// Categories
export const categoryApi = {
 getAll: async () => {
    const { data } = await axiosInstance.get("/categories");
    return data; // returns { success: true, data: [...] }
  },
  create: async (formData) => {
    const { data } = await axiosInstance.post("/categories/add-category", formData);
    return data;
  },
 update: async ({ id, formData }) => {
  // We append the id to the formData so the backend can extract it
  formData.append("_id", id);
  const { data } = await axiosInstance.put(`/categories/update-category`, formData);
  return data;
},
  delete: async (id) => {
    // Standard delete with _id in body to match your controller
    const { data } = await axiosInstance.delete("/categories/delete-category", {
      data: { _id: id }
    });
    return data;
  }
};