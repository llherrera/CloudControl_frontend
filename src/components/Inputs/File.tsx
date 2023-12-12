import React from "react";
import * as XLSX from 'xlsx';

export const FileInput = () => {

    const readExcel = (file: File) => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (e: any) => {
                const bufferArray = e.target.result;
                const wb = XLSX.read(bufferArray, {type: 'buffer'});
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);
                resolve(data);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });

        promise.then((d) => {
            console.log(d);
        });
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files === null) return;
        const file = e.target.files[0];
        readExcel(file);
    }

    return (
        <div className='tw-border-b-4 tw-pb-4 tw-pl-4'>
            <label className='tw-text-[#222222] 
                                tw-font-bold tw-text-lg 
                                tw-font-montserrat'>
                Importar plan por Excel
            </label>
            <input  type="file" 
                    className='tw-ml-3'
                    onChange={(e)=>handleChange(e)}/>
        </div>
    )
}