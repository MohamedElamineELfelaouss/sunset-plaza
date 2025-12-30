"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";

export default function useContent() {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const response = await api.get("/api/content/");
        setContents(response.data);
      } catch (fetchError) {
        console.error("Error connecting to backend:", fetchError);
        setError("Unable to load listings.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { contents, loading, error };
}
