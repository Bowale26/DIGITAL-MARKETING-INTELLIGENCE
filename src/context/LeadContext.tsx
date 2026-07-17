import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lead, initialLeadsData } from '../data/leadData';

interface LeadContextType {
  leads: Lead[];
  updateLead: (updatedLead: Lead) => void;
  addLead: (newLead: Lead) => void;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export const LeadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('flux_leads');
    return saved ? JSON.parse(saved) : initialLeadsData;
  });

  useEffect(() => {
    localStorage.setItem('flux_leads', JSON.stringify(leads));
  }, [leads]);

  const updateLead = (updatedLead: Lead) => {
    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
  };

  const addLead = (newLead: Lead) => {
    setLeads(prev => [newLead, ...prev]);
  };

  return (
    <LeadContext.Provider value={{ leads, updateLead, addLead }}>
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
};
