import React, { useState, useEffect } from 'react';
import { Select, Card, Upload, Button, message, Input, Space } from 'antd';
import { CloudUploadOutlined, CloudDownloadOutlined, SearchOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { Table } from 'antd';
import axios from 'axios';

const Review = () => {
  const [data, setData] = useState(null);
  const [dataSource, setDataSource] = useState();
  const [converted,convertArray] = useState()
  const [rate,setRate] = useState(0);
  const [cgst,setCgst] = useState(0);
  const [sgst,setSgst] = useState(0);
  const [igst,setIgst] = useState(0);
const [resultArray,setResult] = useState([])
  useEffect(() => {
  
    if (data) {
      const newDataSource = data.map((_value, i) => {
        if (_value['GSTIN']) {
          return {
            key: i + 1,
            Suplier_Name: _value['Party Name'],
            GSTIN_of_Supplier: _value['GSTIN'],
            Invoice_Number: _value['Bill No.'],
            Invoice_Date: _value['Bill Date'],
            Invoice_Value: _value['Net Amt'].toFixed(2),
            Plase_Of_Supply: _value['Place of Supply'],
            Reverse_Charge: 'N',
            Invoice_Type: 'Regular',
            Rate: isIgst(_value[" IGST % "])?_value[" IGST % "]:(_value[" CGST % "]+_value[" SGST/UTGST % "]),
            Taxable_Value: _value[" Taxable Value "].toFixed(2),
            Integrated_Tax_Paid: isIgst(_value[" IGST Amt "])?_value[" IGST Amt "].toFixed(2):'',
            Central_Tax_Paid: isIgst(_value[" IGST % "])?'': _value[" CGST Amt "].toFixed(2),
            State_UT_Tax_Paid: isIgst(_value[" IGST % "])?'':_value[" SGST/UTGST Amt "].toFixed(2),
            Cess_Paid: isCess(_value[" Cess Amt "])?_value[" Cess Amt "].toFixed(2) : '',
            Eligibility_For_ITC: 'Yes',
            Availed_Integrated_tax: _value[" IGST Amt "].toFixed(2),
            Availed_ITC_Central_Tax: _value[" CGST Amt "].toFixed(2),
            Availed_ITC_State_UT_Tax: 0,
            Availed_ITC_Cess: _value[" Cess Amt "].toFixed(2),
          };
        }
        return null;
      }).filter(Boolean); // Remove null values
      setDataSource((prevDataSource) => [...prevDataSource, ...newDataSource]);
    }
  }, [data]);

//IS IGST
const isIgst = (val)=>{
return ((val == '') || (val == '-') || !val ) ? false : true;
}

//IS CESS
const isCess = (val)=>{
  return ((val == '') || (val == '-') || !val) ? false : true;
  }


//AGGRECATE RATE
const groupedData = (inputArray) => {inputArray.reduce((acc, entry) => {
  const key = entry.Invoice_Number + entry.Rate;
  if (!acc[key]) {
    acc[key] = { ...entry };
  } else {
    acc[key].Central_Tax_Paid = (parseFloat(acc[key].Central_Tax_Paid) + parseFloat(entry.Central_Tax_Paid)).toFixed(2);
    acc[key].State_UT_Tax_Paid = (parseFloat(acc[key].State_UT_Tax_Paid) + parseFloat(entry.State_UT_Tax_Paid)).toFixed(2);
  }
  return acc;
}, {});

// Convert the map values back to an array
for (const key in groupedData) {
  resultArray.push(groupedData[key]);
}

console.log(resultArray);}

  const columns = [
    {
      title: 'Suplier Name',
      dataIndex: 'Suplier_Name',
      key: 'Suplier_Name',
       width: 200,
       fixed: 'left',
    },
    {
      title: 'GSTIN of Supplier',
      dataIndex: 'GSTIN_of_Supplier',
      key: 'GSTIN_of_Supplier',
       width: 200,
       fixed: 'left',
    },
    {
      title: 'Invoice Number',
      dataIndex: 'Invoice_Number',
      key: 'Invoice_Number',
       width: 200,
    },
    {
        title: 'Invoice Date',
        dataIndex: 'Invoice_Date',
        key: 'Invoice_Date',
         width: 200,
    },
    {
        title: 'Invoice Value',
        dataIndex: 'Invoice_Value',
        key: 'Invoice_Value',
         width: 200,
         render : (text)=>{
          return (text!='' && !text)  && `₹ ${text}`
         }
    },
    {
        title: 'Place Of Supply',
        dataIndex: 'Plase_Of_Supply',
        key: 'Plase_Of_Supply',
         width: 200,
    },
    {
        title: 'Reverse Charge',
        dataIndex: 'Reverse_Charge',
        key: 'Reverse_Charge',
         width: 200,
         render: (text, record) => (
            <div>
                 <Select
      defaultValue="N"
      style={{ width: 120 }}
      options={[{ value: 'N', label: 'N' },{ value: 'Y', label: 'Y' }]}
    />
            </div>
          ),
    },
    {
        title: 'Invoice Type',
        dataIndex: 'Invoice_Type',
        key: 'Invoice_Type',
         width: 200,
         render: (text, record,index) => (
     <div>
                        <Select
      defaultValue="Regular"
      style={{ width: 120 }}
      options={[{ value: 'Regular', label: 'Regular' },{ value: 'SEZ Supplies with Payment', label: 'SEZ Supplies with Payment' },{ value: 'SEZ Supplies without Payment', label: 'SEZ Supplies without Payment' },{ value: 'Deemed Exp', label: 'Deemed Exp' }]}/>
     </div>
          )
    },
    {
        title: 'Rate',
        dataIndex: 'Rate',
        key: 'Rate',
         width: 200,
    },
    {
        title: 'Taxable Value',
        dataIndex: 'Taxable_Value',
        key: 'Taxable_Value',
         width: 200,
         render : (text)=>{
          return (text!='' && !text)  && `₹ ${text}`
       }
    },
    {
        title: 'Integrated Tax Paid',
        dataIndex: 'Integrated_Tax_Paid',
        key: 'Integrated_Tax_Paid',
         width: 200,
         render : (text)=>{
          return (text!='' && !text)  && `₹ ${text}`
       }
    },
    {
        title: 'Central Tax Paid',
        dataIndex: 'Central_Tax_Paid',
        key: 'Central_Tax_Paid',
         width: 200,
         render : (text)=>{
          return (text!='' && !text)  && `₹ ${text}`
       }
    },
    {
        title: 'State/UT Tax Paid',
        dataIndex: 'State/UT_Tax_Paid',
        key: 'State/UT_Tax_Paid',
         width: 200,
         render : (text)=>{
          return (text!='' && !text)  && `₹ ${text}`
       }
    },
    {
        title: 'Cess Paid',
        dataIndex: 'Cess_Paid',
        key: 'Cess_Paid',
         width: 200,
         render : (text)=>{
          return (text!='' && !text)  && `₹ ${text}`
       }
    },
    {
        title: 'Eligiblity For ITC',
        dataIndex: 'Eligiblity_For_ITC',
        key: 'Eligiblity_For_ITC',
         width: 200,
         render: (text, record,index) => (
          <div>
                             <Select
           defaultValue="Inputs"
           style={{ width: 120 }}
           options={[{ value: 'Inputs', label: 'Inputs' },{ value: 'Captital goods', label: 'Captital goods' },{ value: 'Input Services', label: 'Input Services' },{ value: 'Ineligible', label: 'Ineligible' }]}/>
          </div>
               )
    },
    {
        title: 'Availed Integrated Tax',
        dataIndex: 'Availed_Integrated_tax',
        key: 'Availed_Integrated_tax',
         width: 200,
         render : (text)=>{
          return (text!='' && !text)  && `₹ ${text}`
       }
    },
    {
        title: 'Availed ITC Central Tax',
        dataIndex: 'Availed_ITC_Central_Tax',
        key: 'Availed_ITC_Central_Tax',
         width: 200,
         render : (text)=>{
          return (text!='' && !text)  && `₹ ${text}`
       }
    },
    {
        title: 'Availed ITC State/UT Tax',
        dataIndex: 'Availed_ITC_State/UT_Tax ',
        key: 'Availed_ITC_State/UT_Tax',
         width: 200,
      //    render : (text)=>{
      //     return `₹ ${text}`
      //  }
    },
    {
        title: 'Availed ITC Cess',
        dataIndex: 'Availed_ITC_Cess',
        key: 'Availed_ITC_Cess',
         width: 200,
         render : (text)=>{
          return (text!='' && !text)  && `₹ ${text}`
       }
    },
  ];

  const handleFileUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      message.info("Loading...")
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        setData(jsonData);
        message.destroy()
        // Do something with the JSON data, e.g., set it in the component state
      };
      reader.readAsBinaryString(file);
    }
  };

  const beforeUpload = (file) => {
    // Add any file validation logic here
    // For example, check file type or size before uploading
    const isExcel =
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    // if (!isExcel) {
    //   message.error('You can only upload Excel files!');
    // }
    return isExcel;
  };

  const paginationConfig = {
    pageSize: 10, // Set the number of items per page
    // You can customize other pagination options if needed
  };

  const handleDownload = async () => {
    let dd = [];
    let gd  =groupedData(dataSource)
    gd.forEach((val)=>{
      const newArray = Object.values(val).slice(1);
      dd.push(newArray)
    })
    try {
      // Make a POST request to the /download endpoint on your Node.js server
      const response = await fetch('http://localhost:5000/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "datas" : dd
        }),
      });

      // Check if the request was successful (status code 200)
      if (response.ok) {
        // Convert the response to a blob
        const blob = await response.blob();

        // Create a link element to trigger the download
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'myFile.xlsx';

        // Append the link to the document and trigger the download
        document.body.appendChild(link);
        link.click();

        // Remove the link from the document
        document.body.removeChild(link);
      } else {
        console.error('Failed to download Excel file');
      }
      dd = []
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <div style={{ padding: '5px' }}>
      <Card title="JR Groups" style={{ width: '100%', maxWidth: true }}>
        <div style={{ padding: '1px', textAlign: 'center' }}>
          <div>
            <Upload
              beforeUpload={beforeUpload}
              onChange={(file) => handleFileUpload(file.file)}
            >
              <Button
                disabled={data !== null}
                style={{
                  backgroundColor: 'blue',
                  color: 'white',
                }}
                icon={<CloudUploadOutlined />}
              >
                Click to Upload
              </Button>
            </Upload>
          </div>

          {data && (
            <div>
              <br />
              <Table
              pagination={paginationConfig}
                footer={() => (
                  <div>
                    <Button
                      style={{
                        backgroundColor: 'green',
                        color: 'white',
                      }}
                      onClick={()=>{
                        handleDownload()
                      }}
                    >
                      <CloudDownloadOutlined /> Download (Excel Format)
                    </Button>
                  </div>
                )}
                dataSource={dataSource}
                columns={columns}
                scroll={{ x: 3700 }}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Review;
