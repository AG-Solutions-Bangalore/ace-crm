# SIGA CRM

## Project Overview
**SIGA CRM** is a comprehensive Customer Relationship Management (CRM) platform designed for efficient business operations and user management. The project is structured to ensure scalability, maintainability, and ease of collaboration within the organization.

---

## Directory Structure

```
siga-crm/
├── README.md
├── components.json
├── eslint.config.js
├── index.html
├── jsconfig.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── public/
│   ├── assets/
│   └── sound/
└── src/
    ├── App.css
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    ├── app/
    │   ├── amount/
    │   │   ├── AmountEdit.jsx
    │   │   ├── AmountList.jsx
    │   │   └── AmountView.jsx
    │   ├── auth/
    │   │   └── Login.jsx
    │   ├── buisnesOpp/
    │   │   ├── BusinessEdit.jsx
    │   │   ├── BusinessOppList.jsx
    │   │   └── BusinessView.jsx
    │   ├── dashboard/
    │   │   └── page.jsx
    │   ├── directory/
    │   │   ├── DirectoryList.jsx
    │   │   └── DirectoryView.jsx
    │   ├── home/
    │   │   └── Home.jsx
    │   ├── jobOffered/
    │   │   ├── JobOfferedEdit.jsx
    │   │   ├── JobOfferedList.jsx
    │   │   └── JobOfferedView.jsx
    │   ├── jobRequire/
    │   │   ├── JobRequireEdit.jsx
    │   │   ├── JobRequireList.jsx
    │   │   └── JobRequireView.jsx
    │   ├── latestNews/
    │   │   ├── CreateNews.jsx
    │   │   ├── EditNews.jsx
    │   │   ├── LatestNewsList.jsx
    │   │   └── NewView.jsx
    │   ├── participant/
    │   │   ├── ParticipantList.jsx
    │   │   └── ParticipantView.jsx
    │   ├── participation/
    │   │   ├── CalculateAmountDialog.jsx
    │   │   ├── CreateEnquiry.jsx
    │   │   ├── CreateParticipation.jsx
    │   │   ├── EditParticipation.jsx
    │   │   ├── ParticipationList.jsx
    │   │   ├── ParticipationView.jsx
    │   │   └── TestView.jsx
    │   ├── registration/
    │   │   ├── RegistrationList.jsx
    │   │   └── RegistrationView.jsx
    │   ├── report/
    │   │   └── participantSummary/
    │   │       └── ParticipantSummary.jsx
    │   └── userManagement/
    │       ├── ButtonControl.jsx
    │       ├── CreateButtonRole.jsx
    │       ├── PageControl.jsx
    │       └── TabIndex.jsx
    ├── components/
    │   ├── app-sidebar.jsx
    │   ├── nav-main-report.jsx
    │   ├── nav-main-update.jsx
    │   ├── nav-main.jsx
    │   ├── nav-projects.jsx
    │   ├── nav-user.jsx
    │   ├── team-switcher.jsx
    │   ├── base/
    │   │   └── ButtonComponents.jsx
    │   ├── loginAuth/
    │   │   └── LoginAuth.jsx
    │   ├── spinner/
    │   │   └── Spinner.jsx
    │   └── ui/
    │       ├── accordion.jsx
    │       ├── alert-dialog.jsx
    │       ├── alert.jsx
    │       ├── avatar.jsx
    │       ├── badge.jsx
    │       ├── breadcrumb.jsx
    │       ├── button.jsx
    │       ├── calendar.jsx
    │       ├── card.jsx
    │       ├── carousel.jsx
    │       ├── checkbox.jsx
    │       ├── collapsible.jsx
    │       ├── dialog.jsx
    │       ├── dropdown-menu.jsx
    │       ├── form.jsx
    │       ├── input.jsx
    │       ├── label.jsx
    │       ├── popover.jsx
    │       ├── scroll-area.jsx
    │       ├── select.jsx
    │       ├── separator.jsx
    │       ├── sheet.jsx
    │       ├── sidebar.jsx
    │       ├── skeleton.jsx
    │       ├── table.jsx
    │       ├── tabs.jsx
    │       ├── textarea.jsx
    │       ├── toast.jsx
    │       ├── toaster.jsx
    │       └── tooltip.jsx
    ├── config/
    │   └── BaseUrl.jsx
    ├── hooks/
    │   ├── use-mobile.jsx
    │   ├── use-toast.js
    │   ├── useMediaQuery.jsx
    │   └── useSmoothScroll.js
    ├── lib/
    │   ├── ContextPanel.jsx
    │   └── utils.js
    └── utils/
        └── encryption/
            └── Encryption.jsx
```

---

## Features
- **Comprehensive CRM Modules:** Covers all critical areas such as business opportunities, job offerings, and user management.
- **Role-Based Access Control:** User roles and permissions managed dynamically.
- **Modern UI Components:** Built with a focus on responsiveness and accessibility.
- **Integration with APIs:** Smooth communication with backend services using `axios` and `react-query`.

---

## Technology Stack
- **Frontend Framework:** React
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **UI Components:** Radix UI, Material Tailwind, Framer Motion
- **Data Fetching:** Axios, React Query
- **Validation:** React Hook Form, Zod
- **Encryption:** Crypto-JS

---

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/AG-Solutions-Bangalore/siga-crm.git
   cd siga-crm
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## Scripts
- `npm run dev`: Start the development server.
- `npm run build`: Build the project for production.
- `npm run preview`: Preview the production build.
- `npm run lint`: Lint the codebase.

---

## Project-Specific Notes
This project is proprietary to Ag-Solution and is not open-source. All contributions and usage must align with organizational policies.

---

## Contributing
For internal collaboration, follow the company guidelines for:
- Code style and standards
- Commit message formatting
- Code reviews

---

## Contact
For any queries, reach out to the development team via the official communication channels.

