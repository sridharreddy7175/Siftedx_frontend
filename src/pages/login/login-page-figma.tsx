import React from 'react'

export const LoginPageFigma = () => {
  return (
    <div className='login_page'>
      <div className='container-fluid'>
        <div className='login_page_top_div text-center py-4'>ShiftedX</div>
        <div className='row'>
          <div className='col-lg-3 col-md-6 col-11 mx-auto'>
            <div className='rounded-3 log_box px-4 py-4'>
              <h5 className='login_first_line'>Create Your Organization</h5>
              <div className="mb-3 mt-4">
                <label className="form-label form_label_font_size">Organization Name</label>
                <input type="text" className="form-control form_control_styles py-3" id="orgName" placeholder="ABC Crop" />
                <label className="form-label form_label_below_line_font_size">You can edit this later if you wish</label>
              </div>
              <div>
                <button className='login_page_create_organization_btn_styles w-100'>Create Organization</button>
              </div>
            </div>
            <p className='logout mt-2'>Logout</p>
          </div>

          <div>
            <button type="button" className="small_btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
              Launch demo modal
            </button>
            <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <div>
                      <h5 className="modal-title modal_heading_line">Add team members</h5>
                      <p className='modal_para_line'>An invite request email will be sent to their email address</p>
                    </div>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label small_font_size text-black">Enter email addresses to invite</label>
                      <input type="email" className="form-control modal_form_control py-3" id="inviteEmail" placeholder="name@email.com" />
                    </div>
                    <div className='mb-3'>
                      <label className="form-label small_font_size text-black">Add to specific project (Optional)</label>
                      <select className="form-select form-select-sm model_form_select py-3" aria-label=".form-select-sm example">
                        <option selected>Select Project</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </select>
                      <label className="form-label small_font_size">The team members will be added to this project directly</label>
                    </div>
                    <div className='text-end px-4 rounded-3 border-0'>
                      <button className='add_members_btn rounded-3'>Add Members</button>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <p className='py-2'>Share this url to people to join directly <span>www.urllink.com/7890</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
