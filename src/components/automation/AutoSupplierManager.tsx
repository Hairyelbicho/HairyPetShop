
import { useState, useEffect } from 'react';

interface Supplier {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'maintenance';
  orders: number;
  revenue: number;
  responseTime: number;
  successRate: number;
  lastSync: Date;
  apiConnected: boolean;
}

export default function AutoSupplierManager() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [totalStats, setTotalStats] = useState({
    activeSuppliers: 0,
    totalOrders: 0,
    avgResponseTime: 0,
    overallSuccessRate: 0
  });

  useEffect(() => {
    const mockSuppliers: Supplier[] = [
      {
        id: 'SUP-001',
        name: 'PetSupply Pro',
        status: 'active',
        orders: 342,
        revenue: 18450.30,
        responseTime: 2.3,
        successRate: 98.5,
        lastSync: new Date(Date.now() - 5 * 60000),
        apiConnected: true
      },
      {
        id: 'SUP-002', 
        name: 'Animal Warehouse',
        status: 'active',
        orders: 289,
        revenue: 15680.75,
        responseTime: 1.8,
        successRate: 99.2,
        lastSync: new Date(Date.now() - 2 * 60000),
        apiConnected: true
      },
      {
        id: 'SUP-003',
        name: 'MegaPet Distribution',
        status: 'active',
        orders: 456,
        revenue: 24890.20,
        responseTime: 3.1,
        successRate: 97.8,
        lastSync: new Date(Date.now() - 8 * 60000),
        apiConnected: true
      },
      {
        id: 'SUP-004',
        name: 'Equine Excellence',
        status: 'active',
        orders: 123,
        revenue: 12340.50,
        responseTime: 4.2,
        successRate: 96.5,
        lastSync: new Date(Date.now() - 12 * 60000),
        apiConnected: true
      },
      {
        id: 'SUP-005',
        name: 'Vet Equipment Plus',
        status: 'maintenance',
        orders: 67,
        revenue: 8750.25,
        responseTime: 7.5,
        successRate: 94.2,
        lastSync: new Date(Date.now() - 45 * 60000),
        apiConnected: false
      }
    ];

    setSuppliers(mockSuppliers);
    
    const activeSuppliers = mockSuppliers.filter(s => s.status === 'active').length;
    const totalOrders = mockSuppliers.reduce((sum, s) => sum + s.orders, 0);
    const avgResponseTime = mockSuppliers.reduce((sum, s) => sum + s.responseTime, 0) / mockSuppliers.length;
    const overallSuccessRate = mockSuppliers.reduce((sum, s) => sum + s.successRate, 0) / mockSuppliers.length;

    setTotalStats({
      activeSuppliers,
      totalOrders,
      avgResponseTime,
      overallSuccessRate
    });

    // Simulación de sincronización automática cada 60 segundos
    const interval = setInterval(() => {
      setSuppliers(prev => prev.map(supplier => ({
        ...supplier,
        lastSync: supplier.status === 'active' ? new Date() : supplier.lastSync,
        orders: supplier.status === 'active' ? supplier.orders + Math.floor(Math.random() * 3) : supplier.orders
      })));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: Supplier['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Supplier['status']) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'maintenance': return 'Mantenimiento';
      default: return 'Desconocido';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Proveedores Activos</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.activeSuppliers}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i className="ri-store-line text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Órdenes</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="ri-shopping-cart-line text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tiempo Respuesta</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.avgResponseTime.toFixed(1)}min</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <i className="ri-time-line text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tasa de Éxito</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.overallSuccessRate.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <i className="ri-check-double-line text-orange-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Suppliers List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Gestión Automática de Proveedores</h3>
            <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-700 font-medium">Auto-Sync Activo</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proveedor
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Órdenes
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ingresos
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Respuesta
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Éxito
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Sync
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  API
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                        <i className="ri-store-2-line text-white"></i>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                        <div className="text-sm text-gray-500">{supplier.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(supplier.status)}`}>
                      {getStatusText(supplier.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-medium text-gray-900">{supplier.orders}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-medium text-gray-900">€{supplier.revenue.toLocaleString()}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{supplier.responseTime}min</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{supplier.successRate}%</div>
                      <div className={`ml-2 w-2 h-2 rounded-full ${supplier.successRate > 97 ? 'bg-green-500' : supplier.successRate > 95 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-500">{formatTimeAgo(supplier.lastSync)}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      {supplier.apiConnected ? (
                        <div className="flex items-center text-green-600">
                          <i className="ri-wifi-line mr-1"></i>
                          <span className="text-xs">Conectado</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <i className="ri-wifi-off-line mr-1"></i>
                          <span className="text-xs">Desconectado</span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Auto Actions */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
            <i className="ri-robot-line text-white text-xl"></i>
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900">Sistema Totalmente Automatizado</h4>
            <p className="text-gray-600">Funcionando sin intervención manual las 24 horas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <i className="ri-check-line text-green-600"></i>
              </div>
              <div>
                <div className="font-medium text-gray-900">Auto-Pedidos</div>
                <div className="text-sm text-gray-600">Procesamiento automático</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="ri-money-dollar-circle-line text-blue-600"></i>
              </div>
              <div>
                <div className="font-medium text-gray-900">Auto-Pagos</div>
                <div className="text-sm text-gray-600">Gestión financiera automática</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <i className="ri-truck-line text-purple-600"></i>
              </div>
              <div>
                <div className="font-medium text-gray-900">Auto-Envíos</div>
                <div className="text-sm text-gray-600">Seguimiento automático</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
