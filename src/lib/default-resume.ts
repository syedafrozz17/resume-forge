export function getDefaultResumeData() {
  return {
    personal: {
      name: "",
      phone: "",
      email: "",
      linkedin: "",
      linkedinLabel: "",
    },
    summary: "",
    experience: [
      {
        id: Date.now(),
        company: "",
        location: "",
        role: "",
        from: "",
        to: "",
        points: [""] as string[],
      },
    ],
    skills: [
      { id: Date.now() + 1, items: "" },
    ],
    education: [
      {
        id: Date.now() + 2,
        institution: "",
        location: "",
        degree: "",
        from: "",
        to: "",
        coursework: "",
      },
    ],
  };
}

export type ResumeData = ReturnType<typeof getDefaultResumeData>;
