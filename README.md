# Horizon Capital

## International Payments Portal Security Measures

This repository details the security features implemented to safeguard the International Payments Portal. Below is a breakdown of the tools and methods used to protect the system from various vulnerabilities and attacks.

### Security Tools and Methods

1. Express-brute - DDos and Brute-force Attack Prevention
Purpose: Express-brute provides protection against brute-force login attempts and Distributed Denial of Service (DDoS) attacks by limiting the number of login attempts a user can make within a specific time period.
- Brute-force Protection: If a user makes too many failed login attempts, their account is temporarily blocked, preventing automated systems from guessing passwords.
- DDoS Mitigation: Limits excessive requests from a single IP address, reducing the risk of the server being overwhelmed by traffic.

2. express-rate-limit - DDoS Prevention with User Input Limiting
Purpose: This middleware limits the number of transactions a user can perform within a specified timeframe, thus mitigating potential DDoS attacks.
- Transaction Limits: Users can submit a maximum of 100 transactions every 15 minutes. This prevents malicious actors from overwhelming the system with a high volume of requests.
- DDoS Defense: By controlling the rate at which requests are made, the system can prevent attacks aimed at exhausting server resources.

3. Helmet - Clickjacking, Session Hijacking, and XSS Security
Purpose: Helmet is a collection of middleware functions that enhances the security of Express applications by setting HTTP headers appropriately.
- Clickjacking Protection: Helmet prevents attackers from embedding the portal in an iframe, which could otherwise be used to trick users into performing unintended actions.
- Session Hijacking: By managing headers and session configurations, Helmet helps prevent unauthorized access to user sessions.
- Cross-Site Scripting (XSS) Protection: XSS attacks inject malicious scripts into web pages viewed by other users. Helmet ensures that security headers like `Content-Security-Policy` (CSP) are correctly configured to block the execution of unauthorized scripts.

4. jsonwebtoken - Man-in-the-Middle Attack Prevention with Tokens
Purpose: JSON Web Token (JWT) is used to securely transmit information between parties, protecting the communication from Man-in-the-Middle (MitM) attacks.
- Token-based Authentication: When users log in, they receive a token that verifies their identity for a limited time (15 minutes).
- Expiration: Tokens expire after 15 minutes, requiring users to reauthenticate, which minimizes the risk of session hijacking.
- MitM Defense: JWT tokens are signed and verified, ensuring that any unauthorized attempt to intercept or modify the token will be detected.

## Conclusion

These security mechanisms work together to protect the International Payments Portal from a wide array of potential threats, ensuring that user data and transactions remain safe.

## Contributors:

1. Akhona Mbatha: ST10083153
2. Makabongwe Sibisi: ST10145439
3. Khulekani Kubheka: ST10033782
4. Lwazi Zuma : ST10179039
5. Ntobeko Gumede ST10205048



