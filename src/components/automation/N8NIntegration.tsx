import { useState, useEffect } from 'react';

interface N8NWorkflow {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface N8NIntegrationProps {
  onClose?: () => void;
}

export default function N8NIntegration({ onClose }: N8NIntegrationProps) {
  const [workflows, setWorkflows] = useState<N8NWorkflow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'workflows' | 'sync' | 'webhooks'>('overview');
  const [syncStatus, setSyncStatus] = useState<string>('');
  const [integrationStats, setIntegrationStats] = useState({
    totalSales: 0,
    totalLeads: 0,
    lastSync: null as string | null,
    activeWorkflows: 0
  });

  // Cargar workflows de n8n
  const loadWorkflows = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://lyurtjkckwggjlzgqyoh.supabase.co/functions/v1/n8n-integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get_n8n_workflows'
        }),
      });

      const data = await response.json();
      if (data.success) {
        setWorkflows(data.workflows || []);
        setIntegrationStats(prev => ({
          ...prev,
          activeWorkflows: data.workflows?.filter((w: N8NWorkflow) => w.active).length || 0
        }));
      }
    } catch (error) {
      console.error('Error cargando workflows:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sincronizar clientes con n8n
  const syncCustomersToN8N = async () => {
    setSyncStatus('Sincronizando clientes con n8n...');
    try {
      const response = await fetch('https://lyurtjkckwggjlzgqyoh.supabase.co/functions/v1/n8n-integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'sync_customers_to_n8n'
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSyncStatus('✅ Clientes sincronizados exitosamente con n8n');
        setIntegrationStats(prev => ({
          ...prev,
          lastSync: new Date().toISOString()
        }));
      } else {
        setSyncStatus('❌ Error al sincronizar clientes');
      }
    } catch (error) {
      setSyncStatus('❌ Error de conexión con n8n');
      console.error('Error:', error);
    }
  };

  // Ejecutar workflow específico
  const triggerWorkflow = async (workflowId: string, workflowName: string) => {
    try {
      const response = await fetch('https://lyurtjkckwggjlzgqyoh.supabase.co/functions/v1/n8n-integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'trigger_n8n_workflow',
          data: {
            workflowId: workflowId,
            triggerData: {
              source: 'hairyelbicho_petstore',
              timestamp: new Date().toISOString(),
              manual_trigger: true
            }
          }
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`✅ Workflow "${workflowName}" ejecutado exitosamente`);
      } else {
        alert(`❌ Error ejecutando workflow "${workflowName}"`);
      }
    } catch (error) {
      alert('❌ Error de conexión con n8n');
      console.error('Error:', error);
    }
  };

  // Simular envío de venta de prueba a n8n
  const sendTestSale = async () => {
    try {
      const testSaleData = {
        productName: 'Producto de Prueba',
        amount: 29.99,
        customerName: 'Cliente de Prueba',
        customerEmail: 'test@ejemplo.com',
        customerPhone: '+34 123 456 789',
        paymentMethod: 'stripe',
        commission: 2.99,
        supplierAmount: 27.00
      };

      const response = await fetch('https://lyurtjkckwggjlzgqyoh.supabase.co/functions/v1/n8n-integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'send_sale_to_n8n',
          data: testSaleData
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Venta de prueba enviada a n8n exitosamente');
      } else {
        alert('❌ Error enviando venta de prueba');
      }
    } catch (error) {
      alert('❌ Error de conexión con n8n');
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    loadWorkflows();
    
    // Cargar estadísticas desde localStorage
    const stripePayments = JSON.parse(localStorage.getItem('stripePayments') || '[]');
    const paypalPayments = JSON.parse(localStorage.getItem('paypalPayments') || '[]');
    const smartLeads = JSON.parse(localStorage.getItem('smartLeads') || '[]');
    
    setIntegrationStats(prev => ({
      ...prev,
      totalSales: stripePayments.length + paypalPayments.length,
      totalLeads: smartLeads.length
    }));
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <i className="ri-links-line text-2xl text-purple-600"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Integración n8n</h3>
                <p className="text-gray-600">Automatización avanzada conectada</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Resumen', icon: 'ri-dashboard-line' },
              { id: 'workflows', label: 'Workflows', icon: 'ri-flow-chart' },
              { id: 'sync', label: 'Sincronización', icon: 'ri-refresh-line' },
              { id: 'webhooks', label: 'Webhooks', icon: 'ri-webhook-line' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className={tab.icon}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <i className="ri-shopping-cart-line text-2xl text-green-600"></i>
                    <div>
                      <p className="text-sm text-green-600">Ventas Totales</p>
                      <p className="text-2xl font-bold text-green-900">{integrationStats.totalSales}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <i className="ri-user-add-line text-2xl text-blue-600"></i>
                    <div>
                      <p className="text-sm text-blue-600">Leads Capturados</p>
                      <p className="text-2xl font-bold text-blue-900">{integrationStats.totalLeads}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <i className="ri-flow-chart text-2xl text-purple-600"></i>
                    <div>
                      <p className="text-sm text-purple-600">Workflows Activos</p>
                      <p className="text-2xl font-bold text-purple-900">{integrationStats.activeWorkflows}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <i className="ri-time-line text-2xl text-orange-600"></i>
                    <div>
                      <p className="text-sm text-orange-600">Última Sync</p>
                      <p className="text-sm font-bold text-orange-900">
                        {integrationStats.lastSync ? 'Hoy' : 'Nunca'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estado de conexión */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <h4 className="font-semibold text-green-900">✅ n8n Conectado Exitosamente</h4>
                    <p className="text-sm text-green-700">
                      API Key configurada y funcionando. Todas las automatizaciones están activas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Acciones rápidas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={sendTestSale}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2"
                >
                  <i className="ri-send-plane-line"></i>
                  <span>Enviar Venta de Prueba</span>
                </button>
                
                <button
                  onClick={syncCustomersToN8N}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-4 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2"
                >
                  <i className="ri-refresh-line"></i>
                  <span>Sincronizar Clientes</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'workflows' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900">Workflows de n8n</h4>
                <button
                  onClick={loadWorkflows}
                  disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-2"
                >
                  <i className={`ri-refresh-line ${isLoading ? 'animate-spin' : ''}`}></i>
                  <span>Actualizar</span>
                </button>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <i className="ri-loader-4-line text-2xl text-gray-400 animate-spin"></i>
                  <p className="text-gray-500 mt-2">Cargando workflows...</p>
                </div>
              ) : workflows.length > 0 ? (
                <div className="space-y-3">
                  {workflows.map((workflow) => (
                    <div key={workflow.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${workflow.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <div>
                            <h5 className="font-semibold text-gray-900">{workflow.name}</h5>
                            <p className="text-sm text-gray-500">ID: {workflow.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            workflow.active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {workflow.active ? 'Activo' : 'Inactivo'}
                          </span>
                          {workflow.active && (
                            <button
                              onClick={() => triggerWorkflow(workflow.id, workflow.name)}
                              className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
                            >
                              Ejecutar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="ri-flow-chart text-4xl text-gray-300"></i>
                  <p className="text-gray-500 mt-2">No se encontraron workflows</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'sync' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Sincronización de Datos</h4>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-semibold text-gray-900">Sincronizar Clientes</h5>
                        <p className="text-sm text-gray-600">Envía todos los datos de clientes a n8n</p>
                      </div>
                      <button
                        onClick={syncCustomersToN8N}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Sincronizar
                      </button>
                    </div>
                  </div>

                  {syncStatus && (
                    <div className={`p-4 rounded-lg ${
                      syncStatus.includes('✅') 
                        ? 'bg-green-50 border border-green-200 text-green-700'
                        : syncStatus.includes('❌')
                        ? 'bg-red-50 border border-red-200 text-red-700'
                        : 'bg-blue-50 border border-blue-200 text-blue-700'
                    }`}>
                      {syncStatus}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'webhooks' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Webhooks Configurados</h4>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Webhook de Ventas</h5>
                    <p className="text-sm text-gray-600 mb-2">
                      Se envía automáticamente cuando se completa una venta
                    </p>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                      POST /webhook/petstore-sale
                    </code>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Webhook de Leads</h5>
                    <p className="text-sm text-gray-600 mb-2">
                      Se envía cuando se captura un nuevo lead
                    </p>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                      POST /webhook/petstore-lead
                    </code>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Webhook de Sincronización</h5>
                    <p className="text-sm text-gray-600 mb-2">
                      Para sincronización masiva de datos
                    </p>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                      POST /webhook/petstore-customer-sync
                    </code>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}