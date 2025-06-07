import React from 'react';

interface Props {
  name?: string;
  email?: string;
}

const BasicInfo: React.FC<Props> = ({ name, email }) => {
  const handlePasswordReset = async () => {
    const domain = import.meta.env.VITE_AUTH0_DOMAIN;
    const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

    if (!domain || !clientId || !email) {
      alert('Missing configuration or email.');
      return;
    }

    try {
      const response = await fetch(`https://${domain}/dbconnections/change_password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          email,
          connection: 'Username-Password-Authentication',
        }),
      });

      const message = await response.text();
      alert(message);
    } catch (err) {
      console.error('Error triggering password reset:', err);
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="space-y-6 text-lg">
      <p><strong>Name:</strong> {name || 'N/A'}</p>
      <div className="step-divider" />

      <p><strong>Email:</strong> {email || 'N/A'}</p>
      <div className="step-divider" />

      <div className="flex items-center justify-between">
        <p><strong>Password:</strong> •••••••••</p>
        <button
          onClick={handlePasswordReset}
          className="ml-4 bg-purple-700 text-white px-4 py-1.5 rounded-md text-sm hover:bg-purple-800 transition"
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default BasicInfo;