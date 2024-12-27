export const signUpApi = async ({ name, email, password }) => {
    // The Fetch API does not throw an error for HTTP error statuses (e.g., 400 or 500). 
    // Check response.ok to handle this server errors when the promise gets resolved
    // The Fetch API rejects the promise if there's a network error, the request is aborted, or CORS errors
    const response = await fetch(`http://localhost:3000/api/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password })
    });
    const json = await response.json();
    if (!response.ok) {
        throw new Error(json.message);
    }
    return json;
}

export const signInApi = async ({ email, password }) => {
    const response = await fetch(`http://localhost:3000/api/users/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
    });
    const json = await response.json();
    if (!response.ok) {
        throw new Error(json.message);
    }
    return json;
}

export const signOutApi = async () => {
    const response = await fetch(`http://localhost:3000/api/users/signout`, {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });
    const json = await response.json();
    if (!response.ok) {
        throw new Error(json.message);
    }
    return json;
}

export const verifyEmailApi = async (verificationToken) => {
    console.log(verificationToken)
    const response = await fetch(`http://localhost:3000/api/users/verifyEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ verificationToken })
    });
    const json = await response.json();
    if (!response.ok) {
        throw new Error(json.message);
    }
    return json;
}

export const newVerifyEmailApi = async () => {
    const response = await fetch(`http://localhost:3000/api/users/newVerification`, {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });
    const json = await response.json();
    if (!response.ok) {
        throw new Error(json.message);
    }
    return json;
}

export const forgotPasswordApi = async (data) => {
    const response = await fetch(`http://localhost:3000/api/users/forgotPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
    });
    const json = await response.json();
    if (!response.ok) {
        throw new Error(json.message);
    }
    return json;
}

export const resetPasswordApi = async ({ data, resetToken }) => {
    const response = await fetch(`http://localhost:3000/api/users/resetPassword/${resetToken}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
    });
    const json = await response.json();
    if (!response.ok) {
        throw new Error(json.message);
    }
    return json;
}

export const getUserApi = async () => {
    const response = await fetch(`http://localhost:3000/api/users`, {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });
    const json = await response.json();
    if (!response.ok) {
        throw new Error(json.message);
    }
    return json;
}

