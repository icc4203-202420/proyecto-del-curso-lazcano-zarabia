import React, { createContext, useContext, ReactNode } from 'react';

interface Config {
  NGROK_URL: string;
}

const ConfigContext = createContext<Config | undefined>(undefined);

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const config: Config = {
    NGROK_URL: 'https://8c07-186-10-205-114.ngrok-free.app',
  };

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
};


export const useConfig = (): Config => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
