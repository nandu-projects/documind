import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { DocumentProvider, useDocuments } from './context/DocumentContext';
import Sidebar from './components/Navigation/Sidebar';
import Header from './components/Navigation/Header';
import Dashboard from './components/Dashboard/Dashboard';
import DocumentUploader from './components/DocumentUploader/DocumentUploader';
import DocumentLibrary from './components/DocumentLibrary/DocumentLibrary';
import DocumentViewerModal from './components/DocumentViewer/DocumentViewerModal';
import QuestionAnswering from './components/QuestionAnswering/QuestionAnswering';
import SearchEngine from './components/SearchEngine/SearchEngine';
import SummaryGenerator from './components/SummaryGenerator/SummaryGenerator';
import ExhibitionGuide from './components/Exhibition/ExhibitionGuide';
import Settings from './components/Settings/Settings';

function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [prefilledQuestion, setPrefilledQuestion] = useState('');
  const [prefilledSummaryDocId, setPrefilledSummaryDocId] = useState('');

  const handleSelectQuestion = (q) => {
    setPrefilledQuestion(q);
    setActiveTab('qa');
  };

  const handleSelectDocForSummary = (docId) => {
    setPrefilledSummaryDocId(docId);
    setActiveTab('summaries');
  };

  const renderActiveContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            setActiveTab={setActiveTab}
            onSelectQuestion={handleSelectQuestion}
          />
        );
      case 'qa':
        return (
          <QuestionAnswering
            initialQuestion={prefilledQuestion}
            onClearInitialQuestion={() => setPrefilledQuestion('')}
          />
        );
      case 'summaries':
        return (
          <SummaryGenerator
            initialDocId={prefilledSummaryDocId}
            onClearInitialDocId={() => setPrefilledSummaryDocId('')}
          />
        );
      case 'search':
        return <SearchEngine />;
      case 'library':
        return (
          <DocumentLibrary
            setActiveTab={setActiveTab}
            onSelectDocForSummary={handleSelectDocForSummary}
          />
        );
      case 'upload':
        return <DocumentUploader setActiveTab={setActiveTab} />;
      case 'exhibition':
        return (
          <ExhibitionGuide
            setActiveTab={setActiveTab}
            onSelectQuestion={handleSelectQuestion}
          />
        );
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard setActiveTab={setActiveTab} onSelectQuestion={handleSelectQuestion} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area (offset by sidebar width on desktop) */}
      <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setIsMobileOpen={setIsMobileOpen}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveContent()}
        </main>
      </div>

      {/* Global Document Viewer Modal */}
      <DocumentViewerModal />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DocumentProvider>
        <MainApp />
      </DocumentProvider>
    </ThemeProvider>
  );
}
