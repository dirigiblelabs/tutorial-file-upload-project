import { upload, request, response } from "@dirigible/http";

if (request.getMethod() === "POST") {
    if (upload.isMultipartContent()) {
        const fileItems = upload.parseRequest();
        for (let i = 0; i < fileItems.size(); i++) {
            const fileItem = fileItems.get(i);
            const contentType = fileItem.getContentType();
            console.log(`Content Type: ${contentType}`);
            console.log(`Filename: ${fileItem.getOriginalFilename()}`);
            // console.log(`Text: ${fileItem.getText()}`);

            response.setContentType(contentType);
            response.write(fileItem.getBytesNative());
        }
    } else {
        response.println("The request's content must be 'multipart'");
    }
} else if (request.getMethod() === "GET") {
    response.println("Use POST request.");
}

response.flush();
response.close();
