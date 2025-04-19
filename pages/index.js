import React, { useState } from 'react';
import Head from 'next/head';
import FileUpload from '../components/FileUpload';
import ResultTable from '../components/ResultTable';
// import ScoreChart from '../components/ScoreChart'; // Chart removed
import { analyzeFRMResultText } from '../lib/frmTextProcessing';

export default function Home() {
  const [scores, setScores] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileProcessed = async (text) => {
    try {
      setIsProcessing(true);
      setError(null);
      setScores(null);
      const scoreResults = analyzeFRMResultText(text);
      setScores(scoreResults);
    } catch (err) {
      console.error('Error processing text:', err);
      setError(err.message || 'Failed to process the file');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container">
      <Head>
        <title>FRM Result Analyzer</title>
        <meta name="description" content="Analyze FRM exam results from PDFs or text files" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-3xl font-bold mb-4">FRM Exam Result Analyzer</h1>
        <p className="mb-8">Upload your FRM Part I result PDF or text file to analyze your scores by topic.</p>

        <FileUpload
          onFileProcessed={handleFileProcessed}
          isProcessing={isProcessing}
        />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error: </strong> {error}
          </div>
        )}

        {scores && <ResultTable scores={scores} />}
      </main>

      <footer className="mt-12 pt-4 border-t text-center text-gray-500">
        <p>FRM Result Analyzer &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

