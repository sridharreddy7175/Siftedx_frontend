import React from 'react'
import NoData from '../no-data';
import { DataTableCol } from './type';

interface Props {
    tableData: any;
    TableCols: DataTableCol[];
}

export const DataTable: React.FC<Props> = (props) => {
    return (
        <div>
            {
                props.tableData.length >0
                ?
            <table className="table table-borderless table-sm  table-striped  fs_14 border-light ms-1">
                <thead className='thead-light'>
                    <tr className='side_heading' style={{ borderTop: "1px solid #BBBBBB" }}>
                        {props.TableCols.map((el, index) => <th style={{borderTopLeftRadius:index===0 ? '0.3rem':'unset', borderTopRightRadius:index===props.TableCols.length-1?'0.3rem':'unset'}} key={index}>{el.title}</th>)}
                    </tr>
                </thead>
                <tbody className='t_body billing_data_body'>
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
             :<div className='text-start ms-1'>
             <p className='top_para_styles'>No Records Found</p>
            
         </div>
             }

            
        </div>
    )
}
