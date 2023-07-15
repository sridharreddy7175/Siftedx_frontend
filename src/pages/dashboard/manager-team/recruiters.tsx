import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { UsersService } from '../../../app/service/users.service';
import { AppLoader } from '../../../components/loader';
import TeamMember from '../../../components/team-membe';

export const RecruitersMembers = () => {
    const [allMembers, setAllMembers] = useState<any[] | []>([]);
    const companyUuid = sessionStorage.getItem('company_uuid') || '';
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getRecruitersTeam('');
    }, []);


    const getRecruitersTeam = (search: string) => {
        setLoading(true);
        UsersService.getUsersByRole(companyUuid, '4ba3b342-e59f-4619-8ca2-9d1d513c365c', search).then(res => {
            if (res.error) {
                toast.error(res?.error?.message);
                setLoading(false);
            } else {
                setAllMembers([...res]);
                setLoading(false);
            }
        });
    }

    // const onActions = (data: any) => {
    //     console.log("data",data)
    //     if (data.type === 'delete') {
    //         setLoading(true);
    //         data.data.map((data: any, index: number) => {
    //             UsersService.deleteUser(data.uuid).then(res => {
    //                 if (res.error) {
    //                     toast.error(res?.error?.message);
    //                     setLoading(false);
    //                 } else {
    //                     getRecruitersTeam('');
    //                     setLoading(false);
    //                 }
    //             });
    //         })
    //     } else if (data.type === 'makeAdmin' || data.type === 'makeHrManager') {
    //         setLoading(true);
    //         const updateData = {
    //             user_uuid: data.data[0]?.uuid,
    //             role_uuid: data?.role?.uuid
    //         }
    //         UsersService.updateUserRole(updateData).then(res => {
    //             if (res.error) {
    //                 toast.error(res?.error?.message);
    //                 setLoading(false);
    //             } else {
    //                 getRecruitersTeam('');
    //                 setLoading(false);
    //             }
    //         });
    //     } else if (data.type === 'temporarilyDeactivate') {
    //         setLoading(true);
    //         UsersService.temporarilyDeactivate(data.data[0]?.uuid, '2').then(res => {
    //             if (res.error) {
    //                 toast.error(res?.error?.message);
    //                 setLoading(false);
    //             } else {
    //                 getRecruitersTeam('');
    //                 setLoading(false);
    //             }
    //         });
    //     } else if (data.type === 'search') {
    //         getRecruitersTeam(data.data);
    //     }
    // }

    const onActions = (data: any) => {
        console.log("data",data)
        if (data.type === 'delete') {
            setLoading(true);
            data.data.map((data: any, index: number) => {
                UsersService.deleteUser(data.user_uuid).then(res => {
                    if (res.error) {
                        toast.error(res?.error?.message);
                        setLoading(false);
                    } else {
                        setLoading(false);
                        getRecruitersTeam('');
                    }
                });
            })
        } 
        else if (data.type === 'makeAdmin' || data.type === 'Recruiter') {
            setLoading(true);
            const updateData = {
                user_uuid: data.data[0]?.user_uuid,
                role_uuid: data?.role?.uuid
            }
            UsersService.updateUserRole(updateData).then(res => {
                if (res.error) {
                    toast.error(res?.error?.message);
                    setLoading(false);
                } else {
                    getRecruitersTeam('');
                    setLoading(false);
                }
            });
        } else if (data.type === 'temporarilyDeactivate') {
            setLoading(true);
            UsersService.temporarilyDeactivate(data.data[0]?.user_uuid, '2').then(res => {
                if (res.error) {
                    toast.error(res?.error?.message);
                    setLoading(false);
                } else {
                    getRecruitersTeam('');
                    setLoading(false);
                }
            });
        } else if (data.type === 'search') {
            getRecruitersTeam(data.data);
        }
    }
    return (
        <>
            {loading &&
                <AppLoader loading={loading}></AppLoader>
            }
            <div>
                <TeamMember membersData={allMembers} onActions={(event) => onActions(event)}></TeamMember>
            </div>
        </>
    )
}
