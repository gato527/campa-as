<?php 
/** 
 * * @file : class Email 
 * * 
 * * @autor : edwin_eka 
 * * @email : edwinandeka@gmail.com 
 * * * version 1.0 
 * * * fecha: 31 mayo de 2014 
 * * */ 
class Send_email { 

	public static function send($subject ='', $body, $address = array(), $attachments = array() ) { 
		include_once 'libs/PHPMailer/PHPMailerAutoload.php'; 
		
		$mail             = new PHPMailer();

		$mail->IsSMTP(); // telling the class to use SMTP
		$mail->SMTPDebug  = false;                     // enables SMTP debug information (for testing)
		// 1 = errors and messages
		// 2 = messages only
		$mail->SMTPAuth   = true;                  // enable SMTP authentication
		$mail->SMTPSecure = "ssl";                 // sets the prefix to the servier
		$mail->Host       = "mail.dowesoft.com";      // sets GMAIL as the SMTP server
		$mail->Port       = 465;                   // set the SMTP port for the GMAIL server
		$mail->Username   = "redfolder@dowesoft.com";  // GMAIL username
		$mail->Password   = "D@WEsoft1988";            // GMAIL password

		$mail->SetFrom('redfolder@dowesoft.com', 'Redfolder');

		$mail->AddReplyTo("redfolder@dowesoft.com","Redfolder");

		$mail->Subject    = "Nuevo Ticket";

		$mail->MsgHTML($body);

		$address = "edwinandeka@gmail.com";
		$mail->AddAddress($address, "Redfolder");
		//$mail->AddAddress("eficartsas@gmail.com", "Redfolder");

		return $mail->Send(); 
	} 
} 
?>