function generateUniqueLobbyId(): string {
    const timestamp = Date.now().toString(36);
    const randomSuffix = Math.random().toString(36).substring(2, 15); 
    return `${timestamp}-${randomSuffix}`;
}