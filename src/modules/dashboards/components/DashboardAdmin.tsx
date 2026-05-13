
import React from "react";
import ChartsSection from "./ChartsSection";
import DashboardInfoCard from "./DashboardInfoCard";
import {
  UserGroupIcon,
  UserIcon,
  UsersIcon,
  BuildingOffice2Icon,
  ShoppingBagIcon,
  CubeIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import type { AdminDashboard } from '../types/dashboard';

interface Props {
  data: AdminDashboard;
  section?: 'Usuarios' | 'Empresas' | 'Pedidos' | 'Pagos' | 'Productos';
}


export default function DashboardAdmin({ data, section }: Props) {
  // KPIs
  const kpis = [
    {
      label: 'Usuarios',
      value: data.total_users,
      icon: <UserGroupIcon className="w-7 h-7 text-blue-500" />,
      section: 'Usuarios',
    },
    {
      label: 'Clientes',
      value: data.total_clients,
      icon: <UserIcon className="w-7 h-7 text-green-500" />,
      section: 'Usuarios',
    },
    {
      label: 'Asesores',
      value: data.total_advisors,
      icon: <UsersIcon className="w-7 h-7 text-purple-500" />,
      section: 'Usuarios',
    },
    {
      label: 'Administradores',
      value: data.total_admins,
      icon: <UserGroupIcon className="w-7 h-7 text-pink-500" />,
      section: 'Usuarios',
    },
    {
      label: 'Empresas',
      value: data.total_companies,
      icon: <BuildingOffice2Icon className="w-7 h-7 text-yellow-500" />,
      section: 'Empresas',
    },
    {
      label: 'Pedidos',
      value: data.total_orders,
      icon: <ShoppingBagIcon className="w-7 h-7 text-orange-500" />,
      section: 'Pedidos',
    },
    {
      label: 'Pagos',
      value: (data.payment_status?.pending || 0)
        + (data.payment_status?.paid || 0)
        + (data.payment_status?.rejected || 0)
        + (data.payment_status?.cancelled || 0),
      icon: <CurrencyDollarIcon className="w-7 h-7 text-emerald-500" />,
      section: 'Pagos',
    },
    {
      label: 'Productos',
      value: data.total_products,
      icon: <CubeIcon className="w-7 h-7 text-indigo-500" />,
      section: 'Productos',
    },
    {
      label: 'Productos activos',
      value: data.active_products,
      icon: <CubeIcon className="w-7 h-7 text-green-500" />,
      section: 'Productos',
    },
    {
      label: 'Productos inactivos',
      value: data.inactive_products,
      icon: <CubeIcon className="w-7 h-7 text-gray-400" />,
      section: 'Productos',
    },
    {
      label: 'Productos en carritos',
      value: data.products_in_carts,
      icon: <CubeIcon className="w-7 h-7 text-yellow-400" />,
      section: 'Productos',
    },
  ];

  // Agrupar KPIs por sección
  const sections = [
    {
      title: 'Usuarios',
      icon: <UserGroupIcon className="w-8 h-8 text-blue-500" />,
      kpis: kpis.filter(k => k.section === 'Usuarios'),
    },
    {
      title: 'Empresas',
      icon: <BuildingOffice2Icon className="w-8 h-8 text-yellow-500" />,
      kpis: kpis.filter(k => k.section === 'Empresas'),
    },
    {
      title: 'Pedidos',
      icon: <ShoppingBagIcon className="w-8 h-8 text-orange-500" />,
      kpis: kpis.filter(k => k.section === 'Pedidos'),
    },
    {
      title: 'Pagos',
      icon: <CurrencyDollarIcon className="w-8 h-8 text-emerald-500" />,
      kpis: kpis.filter(k => k.section === 'Pagos'),
    },
    {
      title: 'Productos',
      icon: <CubeIcon className="w-8 h-8 text-indigo-500" />,
      kpis: kpis.filter(k => k.section === 'Productos'),
    },
  ];

  // Filtrar secciones según la pestaña activa
  const filteredSections = section ? sections.filter(s => s.title === section) : sections;

  // Colores para los gráficos
  const userRolesColors = ["#60a5fa", "#34d399", "#a78bfa", "#f472b6"];
  const ordersStateColors = ["#fbbf24", "#a78bfa", "#34d399", "#9ca3af", "#f87171"];
  const productsColors = ["#34d399", "#9ca3af"];

  // Totales para leyendas
  const totalUserRoles = data.user_roles_pie?.values?.reduce((a, b) => a + b, 0) || 0;
  const totalOrdersState = data.orders_pie?.values?.reduce((a, b) => a + b, 0) || 0;
  const totalOrdersBar = data.orders_bar?.values?.reduce((a, b) => a + b, 0) || 0;
  const totalProducts = data.products_pie?.values?.reduce((a, b) => a + b, 0) || 0;
  const totalPaymentsBar = data.payments_bar?.values?.reduce((a, b) => a + b, 0) || 0;
    // Layout principal fragmentado
    const infoSection = filteredSections[0];
    // Totales y colores ya definidos arriba
    const charts = (
      <ChartsSection
        data={data}
        section={section}
        userRolesColors={userRolesColors}
        ordersStateColors={ordersStateColors}
        productsColors={productsColors}
        totalUserRoles={totalUserRoles}
        totalOrdersState={totalOrdersState}
        totalOrdersBar={totalOrdersBar}
        totalProducts={totalProducts}
        totalPaymentsBar={totalPaymentsBar}
      />
    );
    // Título y descripción accesibles según la sección
    const sectionTitles: Record<string, string> = {
      'Productos': 'Resumen de productos',
      'Usuarios': 'Resumen de usuarios',
      'Empresas': 'Resumen de empresas',
      'Pagos': 'Resumen de pagos',
      'Pedidos': 'Resumen de pedidos',
    };
    const sectionDescriptions: Record<string, string> = {
      'Productos': 'Visualiza el total de productos, su estado (activos/inactivos) y cuántos están en carritos.',
      'Usuarios': 'Consulta la cantidad de usuarios, clientes, asesores y administradores registrados.',
      'Empresas': 'Mira el total de empresas gestionadas en la plataforma.',
      'Pagos': 'Revisa el total de pagos y su estado actual.',
      'Pedidos': 'Observa el total de pedidos y su distribución por estado.',
    };
    const currentTitle = section && sectionTitles[section] ? sectionTitles[section] : 'Resumen general';
    const currentDesc = section && sectionDescriptions[section] ? sectionDescriptions[section] : '';

    return (
      <div className="w-full flex flex-col items-center">
        <h2 className="text-2xl font-extrabold mb-2 text-gray-800 tracking-tight">{currentTitle}</h2>
        {currentDesc && <p className="mb-6 text-gray-500 text-base text-center max-w-2xl">{currentDesc}</p>}
        {/* Layout horizontal: card info a la izquierda, gráfica a la derecha */}
        {section && infoSection ? (
          <div className="flex flex-col md:flex-row items-start justify-center w-full h-full min-h-100 gap-8">
            <div className="flex justify-center w-full">
              <DashboardInfoCard
                title={infoSection.title}
                icon={infoSection.icon}
                kpis={infoSection.kpis}
                data={data}
              />
            </div>
            <div className="flex justify-center w-full">
              {/* Título específico para la gráfica */}
              {Array.isArray(charts) ? charts[0] : charts}
            </div>
          </div>
        ) : (
          <>
            {charts}
            {infoSection && (
              <DashboardInfoCard
                title={infoSection.title}
                icon={infoSection.icon}
                kpis={infoSection.kpis}
                data={data}
              />
            )}
          </>
        )}
      </div>
    );
}
