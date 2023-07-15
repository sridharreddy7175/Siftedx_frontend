import React from 'react'
import { DataTableCol } from '../type'

interface Props {
    tableData: any;
    TableCols: DataTableCol[];
}

export const DataTabe: React.FC<Props> = (props) => {
    return (
        <div>
            <table className="table table-striped table-bordered fs_14">
                <thead className="thead-light">
                    {props.tableData?.Length > 0 &&
                    <tr>
                        {props.TableCols.map((el, index) => <th key={index}>{el.title}</th>)}
                    </tr>
                    }
                </thead>
                <tbody>
                    {props.tableData.map((item: any, i: number) => (
                <tr key={i}>
                    {props.TableCols.map((el, index) => 
                    <td key={index}>    
                        {item[el.control]}
                    </td>
                    )}
                </tr>
            ))}
                </tbody>
            </table>
            <div className='text-start ms-3' style={{minHeight:'490px'}}>
                 <p>No Records Found</p>
            </div>
        </div>
    )
}