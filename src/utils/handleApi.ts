export const handleApiError = (response: any) => {
    console.log(response.data);
    if (response.status !== 200) {
        if (!response.data.success) {
            if (response.data.error) {
                return `(Code: ${response.data.error.error_code}): ${response.data.error.error_message}`;
            }
        }
    }

    return 'An error occurred with the request.';
}
