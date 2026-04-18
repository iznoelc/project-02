const fields = [
        {
            label: "Enter Organization Main Contact Name",
            value: "formData.display_name",
            placeholder: "Gleebus",
            type: "text",
            id: "display_name",
            name: "display_name",
            required: true,
            validator_hint: "Enter valid display name",
        },
        {
            label: "Enter Organization Name",
            value: "formData.org_name",
            placeholder: "Gleebus Inc.",
            type: "text",
            id: "org_name",
            name: "org_name",
            required: true,
            validator_hint: "Enter valid organization name",
            // icon: 
        },
        {
            label: "Enter Organization Website",
            value: "formData.org_website",
            placeholder: "https://gleebus.com",
            type: "url",
            id: "org_website",
            name: "org_website",
            required: true,
            validator_hint: "Enter valid organization website, must have form http://www.example.com",
        },
        {
            label: "Enter Organization Location",
            value: "formData.org_location",
            placeholder: "New York, NY",
            type: "text",
            id: "org_location",
            name: "org_location",
            required: true,
            validator_hint: "Enter valid organization location",
        },
    ];

    export default fields;