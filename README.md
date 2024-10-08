# Horizon Capital

Payment Portal Security Guidelines
This document outlines the best practices to protect the bank’s international payment portal and secure the system against potential threats. These methods have been identified as crucial to safeguarding sensitive financial data and ensuring secure transactions.

Method 1: Multi-Factor Authentication (MFA)
Objective: Ensure that only authorized employees can access the payment portal.
•	Implementation: Use MFA to add an extra layer of security by requiring users to provide multiple credentials—such as something they know (password), something they have (smart token or mobile app), and something they are (biometric verification).
•	Benefits:
o	Protects against password theft or brute-force attacks.
o	Adds an additional security layer that reduces the risk of unauthorized access.
•	Steps to Secure:
o	Enforce mandatory MFA on all employee accounts.
o	Utilize time-sensitive One-Time Passwords (OTP) or biometric verification.
o	Ensure mobile and hardware tokens used for authentication are frequently updated.

Method 2: Data Encryption
Objective: Safeguard sensitive transaction data as it is transmitted and stored.
•	Implementation: Encrypt both data at rest (stored in the database) and data in transit (being sent to and from the portal) using industry-standard encryption protocols (e.g., AES-256 for data at rest, TLS 1.3 for data in transit).
•	Benefits:
o	Prevents unauthorized users from accessing or tampering with sensitive financial data.
o	Ensures that even if data is intercepted, it cannot be read without the encryption key.
•	Steps to Secure:
o	Use strong encryption algorithms (AES-256, TLS 1.3) for all sensitive data.
o	Regularly rotate encryption keys and manage them securely using a Key Management System (KMS).
o	Encrypt SWIFT transactions, payee information, and employee credentials.

Method 3: Role-Based Access Control (RBAC)
Objective: Limit employee access based on their job role, ensuring only necessary personnel can approve transactions or access sensitive data.
•	Implementation: Use Role-Based Access Control to assign permissions to employees based on their role within the bank. Each role will have access only to the resources and actions necessary to perform their job functions.
•	Benefits:
o	Minimizes the risk of accidental or malicious data exposure.
o	Reduces the attack surface by limiting access to critical functions.
•	Steps to Secure:
o	Define roles and permissions strictly—e.g., only employees in the Payments Department can forward transactions to SWIFT.
o	Implement a policy to review access rights periodically and revoke them when no longer needed.
o	Use audit logs to track actions performed by each user based on their role.

Conclusion
By implementing these methods—Multi-Factor Authentication, Data Encryption, and Role-Based Access Control—the payment portal will be significantly more secure against unauthorized access, data breaches, and other cyber threats. It is essential to regularly update these security measures and monitor the system for vulnerabilities to ensure ongoing protection.

## Contributors:

1. Akhona Mbatha: ST10083153
2. Makabongwe Sibisi: ST10145439
3. Khulekani Kubheka: ST10033782
4. Lwazi Zuma : ST10179039
5. Ntobeko Gumede ST10205048



