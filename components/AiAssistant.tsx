
import React, { useState, useRef, useEffect } from 'react';
import { AiTool } from '../types';
import type { Client, Project } from '../types';
import { getAiChatResponse, matchClientToProjects, createMarketingContent, analyzeFengShui, analyzeLocation } from '../services/geminiService';
import { INITIAL_CLIENTS, INITIAL_PROJECTS } from '../constants';
import { Icon } from './Icon';

const AiAssistant: React.FC = () => {
  const [activeTool, setActiveTool] = useState<AiTool>(AiTool.Chatbot);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  
  // Chatbot state
  const [chatHistory, setChatHistory] = useState<{ role: string; parts: { text: string }[] }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Matcher state
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  // Content creator state
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  
  // Feng Shui state
  const [birthYear, setBirthYear] = useState('');

  // Location Analysis state
  const [address, setAddress] = useState('');

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);
  
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', parts: [{ text: chatInput }] };
    setChatHistory(prev => [...prev, userMessage]);
    setChatInput('');
    setIsLoading(true);

    const aiResponseText = await getAiChatResponse(chatHistory, chatInput);
    const modelMessage = { role: 'model', parts: [{ text: aiResponseText }] };
    setChatHistory(prev => [...prev, modelMessage]);
    setIsLoading(false);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setResult('');
    let response = '';

    try {
      switch (activeTool) {
        case AiTool.Matcher:
          const client = INITIAL_CLIENTS.find(c => c.id === selectedClientId);
          if (client) {
            response = await matchClientToProjects(client, INITIAL_PROJECTS);
          } else {
            response = "Vui lòng chọn một khách hàng để phân tích.";
          }
          break;
        case AiTool.ContentCreator:
          const project = INITIAL_PROJECTS.find(p => p.id === selectedProjectId);
          if (project) {
            response = await createMarketingContent(project);
          } else {
            response = "Vui lòng chọn một dự án để tạo nội dung.";
          }
          break;
        case AiTool.FengShui:
            if (birthYear && parseInt(birthYear, 10)) {
               response = await analyzeFengShui(parseInt(birthYear, 10));
            } else {
               response = "Vui lòng nhập năm sinh hợp lệ.";
            }
            break;
        case AiTool.LocationAnalysis:
            if (address.trim()) {
                response = await analyzeLocation(address.trim());
            } else {
                response = "Vui lòng nhập địa chỉ để phân tích.";
            }
            break;
      }
    } catch (err) {
      response = "Đã có lỗi xảy ra. Vui lòng thử lại.";
    }
    setResult(response);
    setIsLoading(false);
  };
  
  const renderToolUI = () => {
    switch(activeTool) {
      case AiTool.Chatbot:
        return (
          <div className="flex flex-col h-full bg-white rounded-lg shadow-inner">
            <div className="flex-grow p-4 space-y-4 overflow-y-auto">
              {chatHistory.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{msg.parts[0].text}</p>
                  </div>
                </div>
              ))}
               {isLoading && (
                 <div className="flex justify-start">
                   <div className="max-w-xl p-3 rounded-lg bg-gray-200 text-gray-800">
                     <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                     </div>
                   </div>
                 </div>
               )}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-200 flex items-center space-x-2">
              <input 
                type="text" 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)} 
                placeholder="Hỏi trợ lý AI..." 
                className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <button type="submit" className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 disabled:bg-gray-400" disabled={isLoading}>
                <Icon path="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" className="w-5 h-5"/>
              </button>
            </form>
          </div>
        );
        case AiTool.Matcher:
            return (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Chọn khách hàng cần tư vấn</h3>
                    <select onChange={(e) => setSelectedClientId(Number(e.target.value))} defaultValue="" className="w-full p-2 border rounded-md">
                        <option value="" disabled>-- Chọn khách hàng --</option>
                        {INITIAL_CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name} - {c.needs}</option>)}
                    </select>
                </div>
            );
        case AiTool.ContentCreator:
            return (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Chọn dự án để tạo nội dung</h3>
                    <select onChange={(e) => setSelectedProjectId(Number(e.target.value))} defaultValue="" className="w-full p-2 border rounded-md">
                        <option value="" disabled>-- Chọn dự án --</option>
                        {INITIAL_PROJECTS.map(p => <option key={p.id} value={p.id}>{p.name} - {p.location}</option>)}
                    </select>
                </div>
            );
        case AiTool.FengShui:
            return (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Nhập năm sinh (Dương lịch)</h3>
                    <input type="number" value={birthYear} onChange={e => setBirthYear(e.target.value)} placeholder="Ví dụ: 1990" className="w-full p-2 border rounded-md" />
                </div>
            );
        case AiTool.LocationAnalysis:
            return (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Nhập địa chỉ bất động sản</h3>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Ví dụ: 123 Nguyễn Huệ, Quận 1, TP.HCM" className="w-full p-2 border rounded-md" />
                </div>
            );
        default: return null;
    }
  };
  
  return (
    <div className="p-4 md:p-6 h-full flex flex-col">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Trợ lý Sale AI</h1>
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex flex-col space-y-2">
            {Object.values(AiTool).map(tool => (
                <button key={tool} onClick={() => { setActiveTool(tool); setResult(''); }} className={`text-left p-4 rounded-lg font-semibold transition-colors ${activeTool === tool ? 'bg-blue-600 text-white shadow-md' : 'bg-white hover:bg-gray-100 text-gray-700'}`}>
                    {tool}
                </button>
            ))}
        </div>
        <div className="lg:col-span-2 flex flex-col">
            {activeTool === AiTool.Chatbot ? renderToolUI() : (
                <div className="bg-white p-6 rounded-lg shadow-md flex-grow flex flex-col">
                    {renderToolUI()}
                    <button onClick={handleGenerate} disabled={isLoading} className="mt-6 w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-green-700 transition duration-300 disabled:bg-gray-400">
                        {isLoading ? 'Đang xử lý...' : 'Tạo kết quả'}
                    </button>
                    <div className="mt-6 border-t pt-4 flex-grow">
                        <h4 className="font-semibold mb-2">Kết quả từ AI:</h4>
                        <div className="bg-gray-50 p-4 rounded-md h-96 overflow-y-auto prose">
                           {isLoading && <p>AI đang suy nghĩ, vui lòng chờ trong giây lát...</p>}
                           <p style={{ whiteSpace: 'pre-wrap' }}>{result}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
