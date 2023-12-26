import { upload, request, response } from "@dirigible/http";
import { cmis } from "@dirigible/cms";
import { streams } from "@dirigible/io";

if (request.getMethod() === "POST") {
    if (upload.isMultipartContent()) {
        const fileItems = upload.parseRequest();
        for (let i = 0; i < fileItems.size(); i++) {
            const fileItem = fileItems.get(i);

            const fileName = fileItem.getName();
            const contentType = fileItem.getContentType();
            const bytes = fileItem.getBytes();

            const inputStream = streams.createByteArrayInputStream(bytes);

            const cmisSession = cmis.getSession();
            const contentStream = cmisSession.getObjectFactory().createContentStream(fileName, bytes.length, contentType, inputStream);

            cmisSession.createDocument("file-upload-project/uploads", {
                [cmis.OBJECT_TYPE_ID]: cmis.OBJECT_TYPE_DOCUMENT,
                [cmis.NAME]: fileName
            }, contentStream, cmis.VERSIONING_STATE_MAJOR);

        }
        response.sendRedirect("/services/web/ide-documents/");
    } else {
        response.println("The request's content must be 'multipart'");
    }
} else {
    response.println("Use POST request.");
}

response.flush();
response.close();
