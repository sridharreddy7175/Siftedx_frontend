import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { UsersService } from '../../../app/service/users.service';
import { SX_ROLES } from '../../../app/utility/app-codes';
import { AppLoader } from '../../../components/loader';
import TeamMember from '../../../components/team-membe';

export const AdminMembers = () => {
    const [allMembers, setAllMembers] = useState<any[] | []>([]);
    const companyUuid = sessionStorage.getItem('company_uuid') || '';
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getAdminTeam('');
    }, []);

    const getAdminTeam = (search: string) => {
        setLoading(true);
        UsersService.getUsersByRole(companyUuid, 'a399efec-24d3-4187-b7b8-abd08275a3f2', search).then(res => {
            if (res.error) {
                toast.error(res?.error?.message);
                setLoading(false);
            } else {
                setAllMembers([...res]);
                setLoading(false);
            }
        });
    }
    const onActions = (data: any) => {
        if (data.type === 'delete') {
            setLoading(true);
            data.data.map((data: any, index: number) => {
                UsersService.deleteUser(data.user_uuid).then(res => {
                    if (res.error) {
                        toast.error(res?.error?.message);
                        setLoading(false);
                    } else {
                        getAdminTeam('');
                        setLoading(false);
                    }
                });
            })
        } else if (data.type === 'makeAdmin' || data.type === 'makeHrManager') {
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
                    getAdminTeam('');
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
                    getAdminTeam('');
                    setLoading(false);
                }
            });
        } else if (data.type === 'search') {
            getAdminTeam(data.data);
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
