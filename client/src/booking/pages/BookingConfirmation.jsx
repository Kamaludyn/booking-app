import { Link } from "react-router-dom";
import {
  CheckCircle,
  CalendarPlus,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  ChevronLeft,
  Check,
} from "lucide-react";

export default function BookingConfirmation() {
  const booking = {
    id: "BK123456",
    service: "Hair Styling",
    date: "June 15, 2023",
    time: "10:00 AM",
    duration: "45 minutes",
    price: "$45.00",
    professional: "Sarah Johnson",
    location: "Downtown Salon, 123 Beauty St",
    customer: {
      name: "Alex Johnson",
      email: "alex@example.com",
      phone: "(555) 123-4567",
    },
    hasAccount: true,
  };

  // Calendar download links
  const calendarLinks = {
    google: `https://www.google.com/calendar/render?action=TEMPLATE&text=Hair+Appointment&dates=20230615T100000/20230615T104500&location=Downtown+Salon,+123+Beauty+St&details=Your+hair+appointment+with+Sarah+Johnson`,
    outlook: `https://outlook.live.com/calendar/0/deeplink/compose?subject=Hair+Appointment&startdt=2023-06-15T10:00:00&enddt=2023-06-15T10:45:00&location=Downtown+Salon,+123+Beauty+St&body=Your+hair+appointment+with+Sarah+Johnson`,
    ics: `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:20230615T100000
DTEND:20230615T104500
SUMMARY:Hair Appointment
LOCATION:Downtown Salon, 123 Beauty St
DESCRIPTION:Your hair appointment with Sarah Johnson
END:VEVENT
END:VCALENDAR`,
  };

  return (
    <section className="container mx-auto px-4 pb-12">
      <div className="max-w-2xl mx-auto">
        <div className="relative bg-white dark:bg-surface-3 rounded-xl shadow-sm p-6 md:p-8 border border-green-100 dark:border-green-900/50">
          <Link
            to="/book-services"
            className="absolute top-5 left-5 justify-self-start flex items-center p-2 rounded-lg bg-primary-2/10 text-primary-2 hover:underline mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
          </Link>
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-text-600 dark:text-text-400">
              Your appointment has been successfully scheduled
            </p>
            <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
              Confirmation #: {booking.id}
            </div>
          </div>

          <div className="border border-border-800/20 dark:border-text-400 rounded-lg divide-y divide-border-800/20 dark:divide-text-400 mb-8">
            <div className="p-4">
              <h2 className="font-bold text-lg mb-3">{booking.service}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Clock className="w-4 h-4 mt-0.5 mr-2 text-primary-2 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-text-500 dark:text-text-400">
                      Date & Time
                    </div>
                    <div className="font-medium">
                      {booking.date} at {booking.time}
                    </div>
                    <div className="text-sm text-text-500 dark:text-text-400">
                      {booking.duration}
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mt-0.5 mr-2 text-primary-2 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-text-500 dark:text-text-400">
                      Location
                    </div>
                    <div className="font-medium">{booking.location}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-sm font-medium text-text-500 dark:text-text-400 mb-2">
                With
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-2 dark:bg-surface-4 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-2" />
                </div>
                <div>
                  <div className="font-medium">{booking.professional}</div>
                </div>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-sm font-medium text-text-500 dark:text-text-400 mb-2">
                Your Details
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-primary-2" />
                  <span>{booking.customer.name}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-primary-2" />
                  <span>{booking.customer.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-primary-2" />
                  <span>{booking.customer.phone}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-medium mb-3 flex items-center">
              <CalendarPlus className="w-5 h-5 mr-2 text-primary-2" />
              Add to Calendar
            </h3>
            <div className="flex flex-wrap gap-2">
              <a
                href={calendarLinks.google}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-border-800/20 dark:border-text-400 rounded-lg hover:bg-surface-2 dark:hover:bg-text-400 dark:hover:text-text-500 text-sm"
              >
                Google Calendar
              </a>
              <a
                href={calendarLinks.outlook}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-border-800/20 dark:border-text-400 rounded-lg hover:bg-surface-2 dark:hover:bg-text-400 dark:hover:text-text-500 text-sm"
              >
                Outlook
              </a>
              <a
                href={calendarLinks.ics}
                download="appointment.ics"
                className="px-4 py-2 border border-border-800/20 dark:border-text-400 rounded-lg hover:bg-surface-2 dark:hover:bg-text-400 dark:hover:text-text-500 text-sm"
              >
                Download .ics
              </a>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="font-medium mb-2">What's Next?</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <Check className="w-3 h-3 mt-0.5 mr-1.5 flex-shrink-0 text-blue-500" />
                You'll receive a confirmation email with all details
              </li>
              <li className="flex items-start">
                <Check className="w-3 h-3 mt-0.5 mr-1.5 flex-shrink-0 text-blue-500" />
                Reminder notifications 24 hours and 1 hour before
              </li>
              {booking.hasAccount ? (
                <>
                  <li className="flex items-start">
                    <Check className="w-3 h-3 mt-0.5 mr-1.5 flex-shrink-0 text-blue-500" />
                    Manage your appointment in your dashboard
                  </li>
                  <Link
                    to="/user-dashboard"
                    className="inline-block mt-2 px-4 py-2 bg-primary-2 text-white rounded-lg text-sm font-medium hover:bg-primary-2/90"
                  >
                    Go to Dashboard
                  </Link>
                </>
              ) : (
                <li className="flex items-start">
                  <Check className="w-3 h-3 mt-0.5 mr-1.5 flex-shrink-0 text-blue-500" />
                  Consider creating an account to manage future bookings easily
                </li>
              )}
            </ul>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              to="/book-services"
              className="px-6 py-3 bg-primary-2 text-white rounded-lg font-medium hover:bg-primary-2/90 text-center"
            >
              Book Another Service
            </Link>
            <Link
              to="/"
              className="px-6 py-3 border border-border-800/20 dark:border-text-400 rounded-lg font-medium hover:bg-surface-2 dark:hover:bg-text-400 dark:hover:text-text-500 text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
