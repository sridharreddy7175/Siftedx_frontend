import React, { useEffect, useState } from "react";
import FormBuilder from "../../components/form-builder";
import PhoneInput from "react-phone-input-2";
import Select from "react-select";
import { LookUpService } from "../../app/service/lookup.service";
import { CompanyService } from "../../app/service/company.service";

interface Props {
  onSave: (data: any) => void;
}

const Companydetails: React.FC<Props> = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<any>("");
  const [userFormData, setUserFormData] = useState<any>({});
  const [countryesData, setCountryesData] = useState<any[] | []>([]);
  const [phoneNumberError, setPhoneNumberError] = useState<any>("");
  const [countryError, setCountryError] = useState<any>(
    "Please select the country"
  );
  const companyUuid = sessionStorage.getItem("company_uuid") || "";
  const [companyData, setCompanyData] = useState<any>({});
  const [formError, setFormError] = useState<boolean>(false);

  useEffect(() => {
    getCountry();
  }, []);

  const getCountry = () => {
    LookUpService.getCountry().then((res) => {
      res.forEach((element: any) => {
        element.label = `${element?.name}`;
        element.value = element?.code;
      });
      CompanyService.getCompanyById(companyUuid).then((companyRes) => {
        console.log("companyRes", companyRes);
        setCompanyData(companyRes);
      });
      setCountryesData([...res]);
    });
  };

  const onMobileNumber = (event: any) => {
    setPhoneNumberError("");
    const userData = userFormData;
    userData.mobile_no = event;
    setUserFormData({ ...userData });
    if (!event) {
      setPhoneNumberError("Please enter your phone number");
    }
  };

  const onSelectCountry = (selectedList: any) => {
    setCountryError("");
    setSelectedCountry(selectedList);
    const userData = userFormData.value;
    userData.country_code = selectedList.code;
    setUserFormData({ ...userData });
    if (!selectedList.code) {
      setCountryError("Please select the country");
    }
  };

  const handleInput = (data: any) => {
    data.value = { ...userFormData.value, ...data.value };
    setUserFormData(data);
    setFormError(false);
  };
  const onClickCreateCompany = () => {
    setIsSubmitClicked(true);
    const uuid = companyData.uuid;
    const company_name = companyData.company_name;
    let previousData = { ...userFormData.value, uuid, company_name };
    if (
      previousData?.company_name &&
      previousData?.company_email &&
      previousData?.mobile_no &&
      previousData?.company_website &&
      previousData?.country_code
    ) {
      props.onSave(previousData);
    } else {
      setFormError(true);
    }
  };

  return (
    <>
      <div className="mt-4 mb-4">
        <div
          className="bg-white p-4 rounded shadow w-350 mb-3 "
          style={{ margin: "auto" }}
        >
          <div>
            <div className="text-center mb-2 mt-1">
              <p className="fs_14">Create Your Company</p>
            </div>

            <FormBuilder
              onUpdate={handleInput}
              showValidations={isSubmitClicked}
            >
              <form>
                <div className="mb-4 mb-lg-3 mb-sm-4">
                  <input
                    type="text"
                    className="form-control px-3 rounded"
                    name="company_name"
                    placeholder="Company Name*"
                    defaultValue={companyData?.company_name}
                    data-validate-required="Please enter your company name"
                    data-validate-name="Special characters are not allowed"
                  />
                </div>

                <div className="mb-4 mb-lg-3 mb-sm-4">
                  <input
                    type="text"
                    className="form-control px-3 rounded"
                    name="company_website"
                    placeholder="Company Website*"
                    // defaultValue={
                    //   userFormData?.value?.user_lastname
                    // }
                    data-validate-required="Please enter your company website"
                    data-validate-email="company website"
                  />
                </div>

                <div className="mb-4 mb-lg-3 mb-sm-4">
                  <input
                    type="text"
                    className="form-control px-3 rounded"
                    name="company_email"
                    placeholder="Company Email*"
                    // defaultValue={
                    //   userFormData?.value?.user_lastname
                    // }
                    data-validate-required="Please enter your work email"
                    data-validate-email="personal email"
                  />
                </div>
                <div className="mb-4 mb-lg-3 mb-sm-4 mobile_no">
                  <PhoneInput
                    country={"us"}
                    enableSearch={true}
                    value={""}
                    onChange={(phone: any) => onMobileNumber(phone)}
                    inputProps={{
                      name: "mobile_no",
                      placeholder: " ",
                    }}
                  />

                  {isSubmitClicked && !userFormData.phone_number && (
                    <small className="text-danger job_dis_form_label">
                      {phoneNumberError}
                    </small>
                  )}
                </div>

                <div className="mb-4 mb-lg-3 mb-sm-4">
                  <Select
                    value={selectedCountry}
                    placeholder="Select Country*"
                    onChange={(e) => onSelectCountry(e)}
                    options={countryesData}
                    className="input__field_select"
                    isClearable={true}
                    name="country_code"
                  />
                  {isSubmitClicked && !userFormData.country_code && (
                    <small className="text-danger job_dis_form_label">
                      {countryError}
                    </small>
                  )}
                </div>
              </form>
            </FormBuilder>
            {loading ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <button
                  className="btn sx-bg-primary w-100 mb-3"
                  onClick={onClickCreateCompany}
                >
                  Create Company
                </button>
                {formError && (
                  <small className="text-danger me-3 mt-1">
                    Mandatory fields are not filled
                  </small>
                )}
              </>
            )}
          </div>
        </div>
        <p className="top_para_styles text-center pb-4">
          Don't worry, you can change this later
        </p>
      </div>
    </>
  );
};

export default Companydetails;
