import { useState, useCallback } from 'react';
import {
  getClientDashboard,
  getAdvisorDashboard,
  getAdminDashboard,
} from '../services/dashboard';
import type {
  ClientDashboard,
  AdvisorDashboard,
  AdminDashboard,
} from '../types/dashboard';

export function useClientDashboard() {
  const [data, setData] = useState<ClientDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getClientDashboard();
      setData(res);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || 'Error al cargar dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchDashboard };
}

export function useAdvisorDashboard() {
  const [data, setData] = useState<AdvisorDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdvisorDashboard();
      setData(res);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || 'Error al cargar dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchDashboard };
}

export function useAdminDashboard() {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminDashboard();
      setData(res);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || 'Error al cargar dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchDashboard };
}
