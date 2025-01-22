import React from "react";
import { useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Links = () => {
  const location = useLocation();

  // Remove `/admin/` from the beginning and split the rest into segments
  const pathAfterAdmin = location.pathname.replace("/admin/", "");
  const pathnames = pathAfterAdmin.split("/").filter((x) => x);

  // Filter out the ID segment (assuming ID is alphanumeric)
  const filteredPathnames = pathnames.filter(
    (segment) => !/^[a-zA-Z0-9]{24}$/.test(segment) // Assuming IDs are 24-character alphanumeric strings (MongoDB ObjectId format)
  );
  // The test() method returns true if the pattern matches any part of the string, and false otherwise.

  return (
    <div className="mt-5 ml-5">
      <Breadcrumb>
        <BreadcrumbList>
          {/* Dynamic Links */}
          {filteredPathnames.map((value, index) => {
            // Build the URL for each breadcrumb segment
            const to = `/admin/${filteredPathnames
              .slice(0, index + 1)
              .join("/")}`;
            const isLast = index === filteredPathnames.length - 1;

            return (
              <React.Fragment key={to}>
                <BreadcrumbItem>
                  {isLast ? (
                    <span>{value}</span> // No link for the last item
                  ) : (
                    <BreadcrumbLink href={to}>{value}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default Links;
