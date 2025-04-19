import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as pdfjsLib from 'pdfjs-dist';
import ProgressBar from './ProgressBar';

// Ensure PDF.js worker is configured
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const FileUpload = ({ onFileProcessed, isProcessing }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState(null); // Use a general error state

  // Modify PDF processing to extract text
  const processPdf = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const maxPages = pdf.numPages;
    let fullText = '';

    // Extract text from all pages (or relevant pages if the structure is consistent)
    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map(item => item.str).join(' ') + '\n';
    }

    return fullText;
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setFileName(file.name);
    setError(null); // Clear previous errors

    // Start progress animation
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    try {
      let processedContent;

      if (file.type === 'application/pdf') {
        processedContent = await processPdf(file);
      } else if (file.type === 'text/plain') { // Added support for plain text files
         processedContent = await file.text();
      }
      else {
         throw new Error('Unsupported file type. Please upload a PDF or text file.');
      }


      // Process the extracted text
      await onFileProcessed(processedContent);
      setUploadProgress(100);

      // Reset progress after a moment
      setTimeout(() => {
        setUploadProgress(0);
        setFileName(''); // Clear file name on success
      }, 1000);
    } catch (error) {
      console.error('Error processing file:', error);
      setError(error.message || 'Failed to process the file');
      clearInterval(interval);
      setUploadProgress(0);
       setFileName(''); // Clear file name on error
    }
  }, [onFileProcessed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'] // Added support for text files
    },
    maxFiles: 1
  });

  return (
    <div className="mb-8">
      {/* Update the warning note */}
      <div className="mb-4 p-4 border-2 border-blue-600 bg-blue-50 rounded-md">
        <h4 className="text-blue-800 font-bold mb-1">File Preparation Note:</h4>
        <p className="text-blue-800">
          Please upload your FRM Part I result as a PDF or a plain text file.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`upload-container border-2 p-6 rounded-lg text-center ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 border-dashed'}`}
      >
        <input {...getInputProps()} />
        {
          isProcessing ? (
             <p className="text-lg text-blue-600 animate-pulse">Processing file...</p>
          ) : isDragActive ?
            <p className="text-lg">Drop the file here...</p> :
            <div>
              <p className="text-lg mb-2">Drag & drop your FRM result PDF or text file here, or click to select</p>
              <p className="text-sm text-gray-500">Supported formats: PDF, TXT</p>
            </div>
        }
      </div>

      {error && (
        <div className="mt-2 text-red-600">
          <p>{error}</p>
        </div>
      )}

       {isProcessing && fileName && (
         <div className="mt-4">
            <p className="text-sm font-medium">Processing: {fileName}</p>
           <ProgressBar progress={uploadProgress} />
         </div>
       )}
    </div>
  );
};

export default FileUpload;
