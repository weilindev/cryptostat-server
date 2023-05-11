# API Error Code Guide

## Introduction

In this doc, you'll find a list of common error codes that may be returned by the API. These error codes can help you troubleshoot issues and debug your application.

## List of Error Codes

| Error Code | Description |
|   :----:   |    :----    |
| 0 | **Unexpected Error**: This kind of error not in range of expected. May comes from third-party service. Find more details from admin. |
| 1 | **Validate Error**: Something happened when checking request payload, wrong field had given is common reason. More in error message.  |
| 2 | **Missing Query Error**: There is some required query missing.  |
| 100 | **Password Confirm Mismatch**: Password and password confirm is not same as expect. |
| 101 | **Account Already Exist**: This account has already exist. |
| 102 | **Account Not Found**: Cannot find this account record in databases. |
| 103 | **Account Is Not Verify**: This account is not verify yet. |
| 104 | **Password Incorrect**: Password is not correct. |
| 105 | **Verify Code Invalid**: Verify code is incorrect or expired already. |
