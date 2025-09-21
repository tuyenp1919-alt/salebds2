
import React, { useState } from 'react';
import type { Client } from '../types';
import { PipelineStatus } from '../types';
import { INITIAL_CLIENTS, PIPELINE_STAGES, STAGE_COLORS } from '../constants';
import { ClientCard } from './ClientCard';
import { Modal } from './Modal';
import { Icon } from './Icon';

const ClientForm: React.FC<{ client: Client | null; onSave: (client: Client) => void; onCancel: () => void; }> = ({ client, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Client>(client || {
    id: Date.now(),
    name: '',
    phone: '',
    email: '',
    needs: '',
    budget: 0,
    status: PipelineStatus.New,
    history: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'budget' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Họ tên</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
      </div>
       <div>
        <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
      </div>
       <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
      </div>
       <div>
        <label className="block text-sm font-medium text-gray-700">Ngân sách (VNĐ)</label>
        <input type="number" name="budget" value={formData.budget} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Nhu cầu</label>
        <textarea name="needs" value={formData.needs} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
      </div>
       <div>
        <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
        <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
          {PIPELINE_STAGES.map(stage => <option key={stage} value={stage}>{stage}</option>)}
        </select>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Hủy
        </button>
        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Lưu
        </button>
      </div>
    </form>
  );
};


export const ClientManager: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const handleOpenModal = (client: Client | null = null) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleSaveClient = (client: Client) => {
    setClients(prev => {
      if (editingClient) {
        return prev.map(c => c.id === client.id ? client : c);
      }
      return [...prev, client];
    });
    handleCloseModal();
  };


  return (
    <div className="p-4 md:p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý khách hàng</h1>
        <button onClick={() => handleOpenModal()} className="flex items-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
           <Icon path="M12 4.5v15m7.5-7.5h-15" className="w-5 h-5 mr-2" />
           Thêm khách hàng
        </button>
      </div>
      
      <div className="flex-grow overflow-x-auto">
        <div className="flex space-x-4 min-w-max pb-4">
          {PIPELINE_STAGES.map(stage => (
            <div key={stage} className={`w-80 flex-shrink-0 rounded-lg ${STAGE_COLORS[stage]} p-1`}>
              <div className="bg-gray-100/50 rounded-md h-full">
                <h2 className="text-lg font-semibold text-gray-700 p-3 sticky top-0 bg-white/70 backdrop-blur-sm rounded-t-md border-b-2 border-gray-200">
                  {stage} ({clients.filter(c => c.status === stage).length})
                </h2>
                <div className="p-2 space-y-2 overflow-y-auto h-[calc(100vh-200px)]">
                  {clients.filter(c => c.status === stage).map(client => (
                    <ClientCard key={client.id} client={client} onEdit={handleOpenModal} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingClient ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}>
        <ClientForm client={editingClient} onSave={handleSaveClient} onCancel={handleCloseModal} />
      </Modal>
    </div>
  );
};
