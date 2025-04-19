import React, { useState } from 'react';
import Head from 'next/head';
import FileUpload from '../components/FileUpload';
import ResultTable from '../components/ResultTable';
import ScoreChart from '../components/ScoreChart';
// Removed imageProcessing import
// Removed pdfProcessing import
import { analyzeFRMResultText } from '../lib/frmTextProcessing'; // Import the new text processing function

export default function Home() {
  const [scores, setScores] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Modified handleFileProcessed to accept text content
  const handleFileProcessed = async (text) => {
    try {
      setIsProcessing(true);
      setError(null);
      setScores(null);
      // Removed setting debugImage
      // setDebugImage(null);

      // Analyze the text content
      const scoreResults = analyzeFRMResultText(text);
      setScores(scoreResults);

      // No debug image for text processing, so no need to setDebugImage
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
        <title>FRM Result Analyzer</title> {/* Updated title */}
        <meta name="description" content="Analyze FRM exam results from PDFs or text files" /> {/* Updated description */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-3xl font-bold mb-4">FRM Exam Result Analyzer</h1> {/* Updated heading */}
        <p className="mb-8">Upload your FRM Part I result PDF or text file to analyze your scores by topic.</p> {/* Updated description */}

        <FileUpload
          onFileProcessed={handleFileProcessed}
          isProcessing={isProcessing}
        />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error: </strong> {error}
          </div>
        )}

     
        {scores && (
          <>
            <ScoreChart scores={scores} />
            <ResultTable scores={scores} />
          </>
        )}
      </main>

      <footer className="mt-12 pt-4 border-t text-center text-gray-500">
        <p>FRM Result Analyzer &copy; {new Date().getFullYear()}</p> {/* Updated footer text */}
      </footer>
    </div>
  );
}
