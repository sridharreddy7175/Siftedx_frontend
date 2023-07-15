import React from 'react'
import { DataTableCol } from './type';

interface Props {
    tableData: any;
    TableCols: DataTableCol[];
}

export const InterViewDataTable: React.FC<Props> = (props) => {
    return (
        <div>
            <table className="table table-borderless table-sm">
                <thead>
                    <tr className='table_row billing_data_heading' style={{ borderTop: "1px solid #BBBBBB" }}>
                        {props.TableCols.map((el, index) => <th key={index}>{el.title}</th>)}
                    </tr>
                </thead>
                <tbody className='t_body billing_data_body'>
                    {props.tableData.map((item: any, i: number) => (
                        <tr key={i} style={{borderTop: "0.1px solid #BBBBBB"}}>
                            {props.TableCols.map((el, index) =>
                                <td key={index}>
                                    {item[el.control]}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* <div className='text-center'>
                <p>No Records Found</p>
            </div> */}
        </div>
    )
}