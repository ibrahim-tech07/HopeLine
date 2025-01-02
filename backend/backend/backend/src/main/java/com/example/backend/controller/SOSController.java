package com.example.backend.controller;


import com.example.backend.Config.TwilioConfig;
import com.example.backend.DTO.SOSRequest;
import com.example.backend.model.EmergencyContact;
import com.example.backend.service.EmergencyContactService;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user/api")
@CrossOrigin
public class SOSController {

    @Autowired
    private EmergencyContactService emergencyContactService;

    @Autowired
    private TwilioConfig twilioConfig;

    @Value("${twilio.fromPhoneNumber}")
    private String fromPhoneNumber;

    public SOSController(TwilioConfig twilioConfig) {
        Twilio.init(twilioConfig.getAccountSid(), twilioConfig.getAuthToken());
    }

    @PostMapping("/send-sos")
    public ResponseEntity<String> sendSOS(@RequestBody SOSRequest sosRequest) {
        try {
            String userId = sosRequest.getUserId();

            if (userId == null || userId.isEmpty()) {
                return ResponseEntity.badRequest().body("User ID is required.");
            }

            EmergencyContact emergencyContact = emergencyContactService.getContactsByUserId(userId);

            if (emergencyContact == null || emergencyContact.getContacts().isEmpty()) {
                return ResponseEntity.status(404).body("No emergency contacts found for the user.");
            }

            String messageBody = String.format(
                    "Emergency Alert!\nName: %s\nLocation: Latitude %s, Longitude %s\n" +
                            "Google Maps: https://www.google.com/maps?q=%s,%s\nPlease assist immediately.",
                    sosRequest.getUsername(),
                    sosRequest.getLatitude(), sosRequest.getLongitude(),
                    sosRequest.getLatitude(), sosRequest.getLongitude()
            );

            for (EmergencyContact.Contact contact : emergencyContact.getContacts()) {
                if (!contact.getPhoneNumber().equals(fromPhoneNumber)) {
                    Message.creator(
                            new PhoneNumber(contact.getPhoneNumber()),
                            new PhoneNumber(fromPhoneNumber),
                            messageBody
                    ).create();
                }
            }

            return ResponseEntity.ok("SOS messages sent successfully to all emergency contacts.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred while sending SOS messages: " + e.getMessage());
        }
    }

}