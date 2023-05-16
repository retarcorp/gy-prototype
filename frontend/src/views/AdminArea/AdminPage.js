import withAdminWrapper from "./AdminWrapper"

function AdminPage() {
    window.location.href = '/admin/events';
    return <> </>
}

export default withAdminWrapper(AdminPage)