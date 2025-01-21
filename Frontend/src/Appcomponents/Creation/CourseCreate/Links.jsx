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

  return (
    <div className="mt-5 ml-20">
      <Breadcrumb>
        <BreadcrumbList>
          {/* Dynamic Links */}
          {pathnames.map((value, index) => {
            // Build the URL for each breadcrumb segment
            const to = `/admin/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;

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
