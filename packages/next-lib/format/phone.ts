export const formatPhone = (phone: string | number) => {
    if (typeof phone === "number") {
        return phone;
    }

    return phone.replace(/[ -\/)(]/g, "").replace("+49", "0049");
};
